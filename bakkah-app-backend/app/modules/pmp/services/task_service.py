import datetime
from fastapi import HTTPException
from app.core.database import supabase
from app.modules.pmp.schemas.task import TaskCreate, TaskUpdate

class TaskService:
    @staticmethod
    def get_my_tasks(user_id: str):
        try:
            # 1. هنجيب كل الفرق اللي اليوزر ده عضو فيها
            teams_res = supabase.table("team_members").select("team_id").eq("user_id", user_id).execute()
            team_ids = [str(item["team_id"]) for item in teams_res.data] if teams_res.data else []
            
            # 2. هنبني الـ Query عشان نجيب التاسكات
            query = supabase.table("tasks").select("*, projects(name)")
            
            if team_ids:
                teams_str = ",".join(team_ids)
                tasks_res = query.or_(f"assignee_id.eq.{user_id},team_id.in.({teams_str})").execute()
            else:
                tasks_res = query.eq("assignee_id", user_id).execute()
                
            return tasks_res.data
        except Exception as e:
            print(f"Error fetching my tasks: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch your tasks")

    @staticmethod
    def create_task(task: TaskCreate, user_id: str):
        try:
            # استخدام mode='json' لتحويل التواريخ لنصوص تلقائياً
            data = task.model_dump(mode='json')
            data["created_by"] = user_id
            data["project_id"] = str(data["project_id"])
            
            if data.get("parent_task_id"):
                data["parent_task_id"] = str(data["parent_task_id"])

            response = supabase.table("tasks").insert(data).execute()
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_tasks(project_id: str):
        try:
            response = supabase.table("tasks").select("*").eq("project_id", project_id).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update_task(task_id: str, payload: TaskUpdate, user_id: str):
        try:
            # 🌟 الحل الجذري لمشكلة التاريخ: mode='json'
            update_data = payload.model_dump(exclude_unset=True, mode='json')

            if not update_data:
                raise HTTPException(status_code=400, detail="No data to update")

            log_message = None

            log_messages = [] # عملناها List عشان لو غير كذا حاجة مع بعض

            # 1. لو غير الـ Assignee أو الـ Team
            if "team_id" in update_data and update_data["team_id"] is not None:
                update_data["assignee_id"] = None
                try:
                    team_res = supabase.table("space_teams").select("name").eq("id", update_data["team_id"]).execute()
                    team_name = team_res.data[0]["name"] if team_res.data else "a Team"
                    log_messages.append(f"assigned the task to team: {team_name}")
                except:
                    log_messages.append("assigned the task to a team")

            elif "assignee_id" in update_data and update_data["assignee_id"] is not None:
                update_data["team_id"] = None
                try:
                    user_res = supabase.table("profiles").select("username, email").eq("id", update_data["assignee_id"]).execute()
                    if user_res.data:
                        u = user_res.data[0]
                        user_name = u.get("username") or u.get("email") or "a Member"
                        log_messages.append(f"assigned the task to: {user_name}")
                except:
                    log_messages.append("assigned the task to a member")

            elif ("team_id" in update_data and update_data["team_id"] is None) or ("assignee_id" in update_data and update_data["assignee_id"] is None):
                log_messages.append("removed task assignment")

            # 🌟 الإضافة الجديدة: لو غيّر الـ Status
            if "status" in update_data:
                log_messages.append(f"changed status to {update_data['status']}")

            # 🌟 الإضافة الجديدة: لو غيّر التاريخ
            if "due_date" in update_data:
                log_messages.append(f"updated the due date")

            # 🌟 حماية إضافية للتواريخ في حال تم تمرير Date Object بالخطأ
            for key, value in update_data.items():
                if isinstance(value, (datetime.date, datetime.datetime)):
                    update_data[key] = value.isoformat()

            # 2. الحفظ في الداتابيز
            res = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
            
            if not res.data:
                raise HTTPException(status_code=404, detail="Task not found")

            # 3. تسجيل النشاط
            if log_messages:
                try:
                    for msg in log_messages:
                        supabase.table("task_activities").insert({
                            "task_id": task_id,
                            "user_id": user_id,
                            "action": msg 
                        }).execute()
                except Exception as log_error:
                    print(f"Error logging activity: {log_error}")

            return res.data[0]
        except Exception as e:
            print(f"🔥 UPDATE ERROR: {e}")
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete_task(task_id: str):
        try:
            response = supabase.table("tasks").delete().eq("id", task_id).execute()
            return True
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    