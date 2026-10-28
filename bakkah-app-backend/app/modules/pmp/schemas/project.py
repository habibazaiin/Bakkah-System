from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID


class ProjectCreate(BaseModel):
    name: str
    space_id: UUID
    folder_id: Optional[UUID] = None
    status: str = "Planning"

class ProjectResponse(ProjectCreate):
    id: UUID
    owner_id: UUID
    statuses: Optional[List[str]] = None
    
    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    statuses: Optional[List[str]] = None