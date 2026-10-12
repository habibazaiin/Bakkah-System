from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from typing import List
from pydantic import BaseModel

from app.schemas.member import SpaceMemberCreate, InvitationCreate, InvitationResponse
from app.services.member_service import MemberService
from app.api.dependencies import get_current_user
from app.core.database import supabase

router = APIRouter(prefix="/members", tags=["Members, Invites & Notifications"])

# ==========================================
# 1. Schemas & Models
# ==========================================
class RespondAction(BaseModel):
    action: str # "accept" or "decline"

class RoleUpdate(BaseModel):
    role: str

# ==========================================
# 2. RBAC Guard (الحماية)
# ==========================================
def require_admin_or_owner(space_id: str, current_user_id: str):
    # 1. نتأكد الأول لو هو صاحب المساحة الأصلي
    space_res = supabase.table("spaces").select("owner_id").eq("id", space_id).execute()
    if space_res.data and space_res.data[0]["owner_id"] == current_user_id:
        return True # لو هو الأونر، عدي فوراً
        
    # 2. لو مش الأونر الأساسي، نشوف هل هو Admin في الأعضاء ولا لأ
    res = supabase.table("space_members").select("role").eq("space_id", space_id).eq("user_id", current_user_id).execute()
    if not res.data or res.data[0]["role"] not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="You do not have permission to perform this action.")


# ==========================================
# 3. Invitations Routes
# ==========================================
@router.post("/invite", response_model=InvitationResponse)
async def invite_user(invite: InvitationCreate, background_tasks: BackgroundTasks, current_user = Depends(get_current_user)):
    return MemberService.create_invitation(invite, str(current_user.id), background_tasks)

@router.get("/invite/{space_id}", response_model=List[InvitationResponse])
async def get_invitations(space_id: str, current_user = Depends(get_current_user)):
    return MemberService.get_space_invitations(space_id)

@router.post("/invitations/{invite_id}/respond")
async def respond_invite(invite_id: str, payload: RespondAction, current_user = Depends(get_current_user)):
    return MemberService.respond_to_invitation(invite_id, str(current_user.id), payload.action)


# ==========================================
# 4. Members & Role Management Routes
# ==========================================
@router.get("/{space_id}")
async def get_space_members(space_id: str, current_user = Depends(get_current_user)):
    return MemberService.get_space_members(space_id)

@router.patch("/{space_id}/{user_id}/role")
async def update_member_role(space_id: str, user_id: str, payload: RoleUpdate, current_user = Depends(get_current_user)):
    # الحماية: نتأكد إن اللي بيعدل ده أدمن أو أونر
    require_admin_or_owner(space_id, str(current_user.id))
    
    # التنفيذ
    res = supabase.table("space_members").update({"role": payload.role}).eq("space_id", space_id).eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to update role")
    return {"message": "Role updated successfully"}

@router.delete("/{space_id}/{user_id}")
async def remove_member(space_id: str, user_id: str, current_user = Depends(get_current_user)):
    # الحماية: نتأكد إن اللي بيطرد ده أدمن أو أونر
    require_admin_or_owner(space_id, str(current_user.id))
    
    # التنفيذ
    res = supabase.table("space_members").delete().eq("space_id", space_id).eq("user_id", user_id).execute()
    return {"message": "Member removed successfully"}


# ==========================================
# 5. Notifications Routes
# ==========================================
@router.get("/notifications/all")
async def get_notifications(current_user = Depends(get_current_user)):
    return MemberService.get_user_notifications(str(current_user.id))

@router.patch("/notifications/read")
async def read_notifications(current_user = Depends(get_current_user)):
    return MemberService.mark_notifications_read(str(current_user.id))


# ==========================================
# 6. Workspace Users Extended View
# ==========================================
@router.get("/workspace-users/{space_id}")
async def get_workspace_users(space_id: str, current_user = Depends(get_current_user)):
    try:
        # جلب المالك
        space_res = supabase.table("spaces").select("owner_id").eq("id", space_id).execute()
        if not space_res.data:
            return []
        owner_id = space_res.data[0]["owner_id"]
        
        # جلب الأعضاء
        members_res = supabase.table("space_members").select("user_id, role").eq("space_id", space_id).execute()
        members = members_res.data
        
        user_ids = [owner_id] + [m["user_id"] for m in members]
        
        # محاولة جلب البروفايل (ولو فشلت هنكمل عادي)
        profile_map = {}
        try:
            profiles_res = supabase.table("profiles").select("*").in_("id", user_ids).execute()
            for p in profiles_res.data:
                # بيحاول يجيب full_name، لو مش موجود بيجيب email، لو مفيش بيسيبها فاضية
                profile_map[p["id"]] = p.get("full_name") or p.get("first_name") or p.get("email") or ""
        except Exception as e:
            print("Profiles fetch warning:", e)
        
        result = []
        result.append({
            "user_id": owner_id,
            "role": "owner",
            "name": profile_map.get(owner_id) or "Workspace Owner"
        })
        
        for m in members:
            result.append({
                "user_id": m["user_id"],
                "role": m["role"],
                "name": profile_map.get(m["user_id"]) or f"Team Member {m['user_id'][:4]}"
            })
            
        return result
    except Exception as e:
        print("Error fetching workspace users:", str(e))
        raise HTTPException(status_code=400, detail=str(e))