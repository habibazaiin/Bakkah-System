from fastapi import HTTPException
from app.core.database import supabase
from app.schemas.member import SpaceMemberCreate, InvitationCreate
from app.services.email_service import send_real_email

class MemberService:
    @staticmethod
    def get_space_members(space_id: str):
        response = supabase.table("space_members").select("*").eq("space_id", space_id).execute()
        return response.data

    @staticmethod
    def create_invitation(data: InvitationCreate, user_id: str, background_tasks):
        space_id_str = str(data.space_id)
        
        existing_invite = supabase.table("invitations").select("*").eq("space_id", space_id_str).eq("email", data.email).execute()
        
        if existing_invite.data:
            old_invite = existing_invite.data[0]
            if old_invite["status"] == "pending":
                raise HTTPException(status_code=400, detail="Invitation already pending for this email.")
            else:
                supabase.table("invitations").delete().eq("id", old_invite["id"]).execute()

        dump = data.model_dump()
        dump["space_id"] = space_id_str
        dump["created_by"] = user_id
        
        try:
            response = supabase.table("invitations").insert(dump).execute()
            invite = response.data[0]
            
            invite_token = invite.get("token") or invite["id"] 
            invite_link = f"http://localhost:3000/pmp/invitations/{invite_token}"
            
            html_body = f"""
            <h3>You have been invited!</h3>
            <p>You have been invited to join a workspace on Bakkah PMP as a <b>{data.role}</b>.</p>
            <a href="{invite_link}" style="display:inline-block; padding:10px 20px; background:#1E5A7A; color:#fff; text-decoration:none; border-radius:8px;">View Invitation</a>
            """
            background_tasks.add_task(send_real_email, data.email, "Workspace Invitation - Bakkah PMP", html_body)
            
            return invite
        except Exception as e:
            if "duplicate key" in str(e).lower():
                raise HTTPException(status_code=400, detail="Invitation already sent to this email.")
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_space_invitations(space_id: str):
        response = supabase.table("invitations").select("*").eq("space_id", space_id).eq("status", "pending").execute()
        return response.data

    @staticmethod
    def respond_to_invitation(invite_id: str, user_id: str, action: str):
        invite_res = supabase.table("invitations").select("*").eq("id", invite_id).execute()
        if not invite_res.data:
            raise HTTPException(status_code=404, detail="Invitation not found")
        
        invite = invite_res.data[0]
        if invite["status"] != "pending":
            raise HTTPException(status_code=400, detail="Invitation already processed")

        new_status = "accepted" if action == "accept" else "declined"
        supabase.table("invitations").update({"status": new_status}).eq("id", invite_id).execute()

        if action == "accept":
            try:
                supabase.table("space_members").insert({
                    "space_id": invite["space_id"],
                    "user_id": user_id,
                    "role": invite["role"]
                }).execute()
            except:
                pass 

        notification_title = "Invitation Accepted" if action == "accept" else "Invitation Declined"
        notification_msg = f"{invite['email']} has {new_status} your workspace invitation."
        
        supabase.table("notifications").insert({
            "user_id": invite["created_by"],
            "title": notification_title,
            "message": notification_msg
        }).execute()

        return {"message": f"Invitation {new_status} successfully"}