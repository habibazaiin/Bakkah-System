from app.core.database import supabase
from fastapi import HTTPException

class ActivityService:
    @staticmethod
    def log_activity(task_id: str, user_id: str, action: str, details: str = None):
        try:
            data = {
                "task_id": task_id,
                "user_id": user_id,
                "action": action,
                "details": details
            }
            supabase.table("task_activities").insert(data).execute()
        except Exception as e:
            import traceback
            print(f"🔥 ACTIVITIES ERROR: {str(e)}")
            traceback.print_exc()
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_task_activities(task_id: str):
        try:
            # 1. جلب النشاطات مرتبة
            res = supabase.table("task_activities").select("*").eq("task_id", task_id).order("created_at", desc=True).execute()
            activities = res.data
            if not activities:
                return []

            # 2. تجميع معرفات المستخدمين
            user_ids = list(set([a["user_id"] for a in activities if a.get("user_id")]))
            
            # 3. جلب بيانات البروفايل ودمجها (Manual Join)
            if user_ids:
                profiles_res = supabase.table("profiles").select("id, username, email").in_("id", user_ids).execute()
                profiles_map = {p["id"]: p for p in profiles_res.data}
                
                for a in activities:
                    user_id = a.get("user_id")
                    a["profiles"] = profiles_map.get(user_id, {})
                    
            return activities
        except Exception as e:
            import traceback
            print(f"🔥 ACTIVITIES ERROR: {str(e)}")
            traceback.print_exc()
            raise HTTPException(status_code=400, detail=str(e))