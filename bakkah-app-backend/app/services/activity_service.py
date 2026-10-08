from app.core.database import supabase # اتأكدي من المسار ده زي ما متعودين
from fastapi import HTTPException

class ActivityService:
    @staticmethod
    def log_activity(task_id: str, user_id: str, action: str, details: str = None):
        # الدالة دي هنناديها من أي مكان في الباك إند عشان تسجل اللي بيحصل بصمت
        try:
            data = {
                "task_id": task_id,
                "user_id": user_id,
                "action": action,
                "details": details
            }
            supabase.table("task_activities").insert(data).execute()
        except Exception as e:
            print(f"Failed to log activity: {e}")

    @staticmethod
    def get_task_activities(task_id: str):
        try:
            # جلب الحركات مرتبة من الأقدم للأحدث
            response = supabase.table("task_activities").select("*").eq("task_id", task_id).order("created_at", desc=False).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))