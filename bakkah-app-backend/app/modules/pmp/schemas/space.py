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

# 🌟 Schema جديدة للتعديل (كل الحقول اختيارية عشان يقدر يعدل الاسم بس لو حابب) 🌟
class SpaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None

class SpaceResponse(SpaceBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True