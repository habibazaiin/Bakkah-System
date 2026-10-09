from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class SpaceMemberCreate(BaseModel):
    space_id: UUID
    user_id: UUID
    role: str = "member"

class InvitationCreate(BaseModel):
    space_id: UUID
    email: str
    role: str = "member"

class InvitationResponse(InvitationCreate):
    id: UUID
    status: str
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True