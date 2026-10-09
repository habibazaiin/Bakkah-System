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
        dump = data.model_dump()
        dump["space_id"] = str(dump["space_id"])
        dump["created_by"] = user_id
        
        try:
            response = supabase.table("invitations").insert(dump).execute()
            invite = response.data[0]
            
            # تجهيز الإيميل وإرساله في الخلفية (عشان ميعطلش الـ API)
            invite_link = f"http://localhost:3000/pmp/invitations/{invite['id']}"
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
        # 1. جلب الدعوة
        invite_res = supabase.table("invitations").select("*").eq("id", invite_id).execute()
        if not invite_res.data:
            raise HTTPException(status_code=404, detail="Invitation not found")
        
        invite = invite_res.data[0]
        if invite["status"] != "pending":
            raise HTTPException(status_code=400, detail="Invitation already processed")

        # 2. تحديث حالة الدعوة (accepted أو declined)
        new_status = "accepted" if action == "accept" else "declined"
        supabase.table("invitations").update({"status": new_status}).eq("id", invite_id).execute()

        # 3. لو وافق، ضيفه في الـ Space
        if action == "accept":
            try:
                supabase.table("space_members").insert({
                    "space_id": invite["space_id"],
                    "user_id": user_id,
                    "role": invite["role"]
                }).execute()
            except:
                pass # لو موجود قبل كده مفيش مشكلة

        # 4. إرسال إشعار (Notification) للشخص اللي بعت الدعوة
        notification_title = "Invitation Accepted" if action == "accept" else "Invitation Declined"
        notification_msg = f"{invite['email']} has {new_status} your workspace invitation."
        
        supabase.table("notifications").insert({
            "user_id": invite["created_by"],
            "title": notification_title,
            "message": notification_msg
        }).execute()

        return {"message": f"Invitation {new_status} successfully"}

    @staticmethod
    def get_user_notifications(user_id: str):
        res = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return res.data

    @staticmethod
    def mark_notifications_read(user_id: str):
        supabase.table("notifications").update({"is_read": True}).eq("user_id", user_id).eq("is_read", False).execute()
        return {"message": "Marked as read"}