from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class TeamCreate(BaseModel):
    space_id: UUID
    name: str
    description: Optional[str] = ""

class TeamMemberAdd(BaseModel):
    user_id: UUID