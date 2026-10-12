from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.task import TaskCreate, TaskResponse
from app.services.task_service import TaskService
from app.api.dependencies import get_current_user
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.core.database import supabase

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, current_user = Depends(get_current_user)):
    return TaskService.create_task(task, str(current_user.id))

@router.get("/{project_id}", response_model=List[TaskResponse])
async def get_tasks(project_id: str, current_user = Depends(get_current_user)):
    return TaskService.get_tasks(project_id)

@router.patch("/{task_id}")
async def update_task(task_id: str, payload: TaskUpdate, current_user = Depends(get_current_user)):
    # 1. بناخد الداتا اللي مبعوتة من الفرونت إند (اللي هي team_id بس)
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")

    # 2. 🌟 اللوجيك الصارم: لو فيه فريق، امسح العضو.. ولو فيه عضو، امسح الفريق 🌟
    if "team_id" in update_data and update_data["team_id"] is not None:
        update_data["assignee_id"] = None
        
    if "assignee_id" in update_data and update_data["assignee_id"] is not None:
        update_data["team_id"] = None

    # 3. عشان نتأكد إن الداتا مظبوطة قبل ما تروح لـ Supabase
    print("🚀 FINAL DATA TO SUPABASE:", update_data) 

    # 4. الحفظ في الداتابيز
    res = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Task not found")
        
    return res.data[0]

@router.delete("/{task_id}")
async def delete_task(task_id: str, current_user = Depends(get_current_user)):
    TaskService.delete_task(task_id)
    return {"message": "Task deleted successfully"}