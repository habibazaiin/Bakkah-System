from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from uuid import UUID

class TaskCreate(BaseModel):
    title: str
    project_id: UUID
    description: Optional[str] = None
    status: str = "To Do"
    priority: str = "Medium"
    start_date: Optional[date] = None
    due_date: Optional[date] = None

class TaskResponse(TaskCreate):
    id: UUID
    progress: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    progress: Optional[float] = None