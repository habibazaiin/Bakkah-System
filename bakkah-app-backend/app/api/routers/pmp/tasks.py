from fastapi import APIRouter, Depends
from typing import List
from app.schemas.task import TaskCreate, TaskResponse
from app.services.task_service import TaskService
from app.api.dependencies import get_current_user
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, current_user = Depends(get_current_user)):
    return TaskService.create_task(task, str(current_user.id))

@router.get("/{project_id}", response_model=List[TaskResponse])
async def get_tasks(project_id: str, current_user = Depends(get_current_user)):
    return TaskService.get_tasks(project_id)

@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task: TaskUpdate, current_user = Depends(get_current_user)):
    # تنظيف البيانات عشان نبعت القيم اللي اتغيرت بس
    update_data = {k: v for k, v in task.model_dump().items() if v is not None}
    return TaskService.update_task(task_id, update_data)