from fastapi import APIRouter, Depends, BackgroundTasks
from typing import List
from app.schemas.member import SpaceMemberCreate, InvitationCreate, InvitationResponse
from app.services.member_service import MemberService
from app.api.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/members", tags=["Members, Invites & Notifications"])

class RespondAction(BaseModel):
    action: str # "accept" or "decline"

# --- Invitations ---
@router.post("/invite", response_model=InvitationResponse)
async def invite_user(invite: InvitationCreate, background_tasks: BackgroundTasks, current_user = Depends(get_current_user)):
    return MemberService.create_invitation(invite, str(current_user.id), background_tasks)

@router.get("/invite/{space_id}", response_model=List[InvitationResponse])
async def get_invitations(space_id: str, current_user = Depends(get_current_user)):
    return MemberService.get_space_invitations(space_id)

@router.post("/invite/{invite_id}/respond")
async def respond_invite(invite_id: str, payload: RespondAction, current_user = Depends(get_current_user)):
    return MemberService.respond_to_invitation(invite_id, str(current_user.id), payload.action)

# --- Members ---
@router.get("/{space_id}")
async def get_space_members(space_id: str, current_user = Depends(get_current_user)):
    return MemberService.get_space_members(space_id)

# --- Notifications ---
@router.get("/notifications/all")
async def get_notifications(current_user = Depends(get_current_user)):
    return MemberService.get_user_notifications(str(current_user.id))

@router.patch("/notifications/read")
async def read_notifications(current_user = Depends(get_current_user)):
    return MemberService.mark_notifications_read(str(current_user.id))