from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class ProjectCreate(BaseModel):
    name: str
    space_id: UUID
    folder_id: Optional[UUID] = None
    status: str = "Planning"

class ProjectResponse(ProjectCreate):
    id: UUID
    owner_id: UUID
    
    class Config:
        from_attributes = True