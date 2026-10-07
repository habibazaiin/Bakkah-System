# app/schemas/space.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class SpaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None

class SpaceCreate(SpaceBase):
    pass

class SpaceResponse(SpaceBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True