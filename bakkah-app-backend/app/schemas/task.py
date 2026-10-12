from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskCreate(BaseModel):
    title: str
    project_id: str  # 🌟 اتعدلت لـ str عشان Supabase ميضربش إيرور وقت الكرييت
    parent_task_id: Optional[str] = None  # 🌟 اتعدلت لـ str
    assignee_id: Optional[str] = None 
    team_id: Optional[str] = None
    description: Optional[str] = None
    status: str = "To Do"
    priority: str = "Medium"
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    

class TaskResponse(TaskCreate):
    id: str  # 🌟 اتعدلت لـ str
    progress: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    progress: Optional[float] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    parent_task_id: Optional[str] = None
    assignee_id: Optional[str] = None 
    team_id: Optional[str] = None