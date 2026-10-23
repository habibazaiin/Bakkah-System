from fastapi import APIRouter, Depends, HTTPException
from app.schemas.team import TeamCreate, TeamMemberAdd, TeamUpdate
from app.services.team_service import TeamService
from app.api.dependencies import get_current_user
from app.core.database import supabase

router = APIRouter(prefix="/teams", tags=["Teams"])

# دالة الحماية (RBAC)
def require_admin_or_owner(space_id: str, current_user_id: str):
    space_res = supabase.table("spaces").select("owner_id").eq("id", space_id).execute()
    if space_res.data and space_res.data[0]["owner_id"] == current_user_id:
        return True
        
    res = supabase.table("space_members").select("role").eq("space_id", space_id).eq("user_id", current_user_id).execute()
    if not res.data or res.data[0]["role"] not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="You do not have permission to manage teams.")

@router.post("/")
async def create_team(team: TeamCreate, current_user = Depends(get_current_user)):
    require_admin_or_owner(str(team.space_id), str(current_user.id))
    return TeamService.create_team(str(team.space_id), team.name, team.description)

@router.get("/{space_id}")
async def get_teams(space_id: str, current_user = Depends(get_current_user)):
    return TeamService.get_space_teams(space_id)

@router.delete("/{space_id}/{team_id}")
async def delete_team(space_id: str, team_id: str, current_user = Depends(get_current_user)):
    require_admin_or_owner(space_id, str(current_user.id))
    return TeamService.delete_team(team_id)

@router.post("/{space_id}/{team_id}/members")
async def add_team_member(space_id: str, team_id: str, payload: TeamMemberAdd, current_user = Depends(get_current_user)):
    require_admin_or_owner(space_id, str(current_user.id))
    return TeamService.add_member_to_team(team_id, str(payload.user_id))

@router.delete("/{space_id}/{team_id}/members/{user_id}")
async def remove_team_member(space_id: str, team_id: str, user_id: str, current_user = Depends(get_current_user)):
    require_admin_or_owner(space_id, str(current_user.id))
    return TeamService.remove_member_from_team(team_id, user_id)

@router.patch("/{space_id}/{team_id}")
async def update_team(space_id: str, team_id: str, team_data: TeamUpdate, current_user = Depends(get_current_user)):
    require_admin_or_owner(space_id, str(current_user.id))
    return TeamService.update_team(team_id, team_data.name)