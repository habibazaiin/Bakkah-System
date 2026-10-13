from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.task import TaskCreate, TaskResponse
from app.services.task_service import TaskService
from app.api.dependencies import get_current_user
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.core.database import supabase


router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("/my-tasks")
async def get_my_tasks(current_user = Depends(get_current_user)):
    try:
        user_id = current_user.id  # أو current_user["id"] حسب ما انتي معرفاها عندك
        
        # 1. هنجيب كل الفرق اللي اليوزر ده عضو فيها
        teams_res = supabase.table("team_members").select("team_id").eq("user_id", user_id).execute()
        team_ids = [str(item["team_id"]) for item in teams_res.data] if teams_res.data else []
        
        # 2. هنبني الـ Query عشان نجيب التاسكات
        # استخدمنا select("*, projects(name)") عشان نجيب اسم المشروع مع كل تاسك
        query = supabase.table("tasks").select("*, projects(name)")
        
        if team_ids:
            # لو اليوزر ده في فرق، هنجيب مهامه المباشرة + مهام فرقه
            teams_str = ",".join(team_ids)
            tasks_res = query.or_(f"assignee_id.eq.{user_id},team_id.in.({teams_str})").execute()
        else:
            # لو مش في أي فريق، هنجيب مهامه المباشرة بس
            tasks_res = query.eq("assignee_id", user_id).execute()
            
        return tasks_res.data

    except Exception as e:
        print(f"Error fetching my tasks: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch your tasks")

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, current_user = Depends(get_current_user)):
    return TaskService.create_task(task, str(current_user.id))

@router.get("/{project_id}", response_model=List[TaskResponse])
async def get_tasks(project_id: str, current_user = Depends(get_current_user)):
    return TaskService.get_tasks(project_id)

@router.patch("/{task_id}")
async def update_task(task_id: str, payload: TaskUpdate, current_user = Depends(get_current_user)):
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")

    log_message = None

    # 🌟 1. تحديد نوع التعيين وتجهيز رسالة الـ Activity Log 🌟
    if "team_id" in update_data and update_data["team_id"]:
        # لو التعيين رايح لفريق
        update_data["assignee_id"] = None
        try:
            team_res = supabase.table("space_teams").select("name").eq("id", update_data["team_id"]).execute()
            team_name = team_res.data[0]["name"] if team_res.data else "a Team"
            log_message = f"assigned the task to team: {team_name}"
        except Exception:
            log_message = "assigned the task to a team"

    elif "assignee_id" in update_data and update_data["assignee_id"]:
        # لو التعيين رايح لعضو
        update_data["team_id"] = None
        try:
            user_res = supabase.table("profiles").select("full_name, first_name, email").eq("id", update_data["assignee_id"]).execute()
            if user_res.data:
                u = user_res.data[0]
                user_name = u.get("full_name") or u.get("first_name") or u.get("email") or "a Member"
            else:
                user_name = "a Member"
            log_message = f"assigned the task to: {user_name}"
        except Exception:
            log_message = "assigned the task to a member"

    elif ("team_id" in update_data and not update_data["team_id"]) or ("assignee_id" in update_data and not update_data["assignee_id"]):
        # لو تم إزالة التعيين
        log_message = "removed task assignment"

    # 🌟 2. حفظ التعديلات في التاسك 🌟
    res = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Task not found")

    # 🌟 3. تسجيل النشاط في الداتابيز 🌟
    if log_message:
        try:
            # 💡 ملحوظة: تأكدي إن اسم الجدول 'task_activities' واسم العمود 'action' مطابقين للي عندك في Supabase
            supabase.table("task_activities").insert({
                "task_id": task_id,
                "user_id": str(current_user.id),
                "action": log_message 
            }).execute()
        except Exception as log_error:
            print(f"Error logging activity: {log_error}")

    return res.data[0]

@router.delete("/{task_id}")
async def delete_task(task_id: str, current_user = Depends(get_current_user)):
    TaskService.delete_task(task_id)
    return {"message": "Task deleted successfully"}