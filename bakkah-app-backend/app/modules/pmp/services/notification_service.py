from fastapi import HTTPException
from app.core.database import supabase

class NotificationService:
    @staticmethod
    def get_user_notifications(user_id: str):
        try:
            res = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return res.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def mark_notifications_read(user_id: str):
        try:
            supabase.table("notifications").update({"is_read": True}).eq("user_id", user_id).eq("is_read", False).execute()
            return {"message": "Marked as read"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    # 🌟 الدالة الجديدة الخاصة بمسح الإشعار
    @staticmethod
    def delete_notification(notification_id: str, user_id: str):
        try:
            # نتأكد إننا بنمسح الإشعار الخاص باليوزر ده بس للحماية
            supabase.table("notifications").delete().eq("id", notification_id).eq("user_id", user_id).execute()
            return {"message": "Notification deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))