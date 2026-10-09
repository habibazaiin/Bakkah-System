from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class FolderCreate(BaseModel):
    name: str
    space_id: UUID

class FolderResponse(FolderCreate):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True