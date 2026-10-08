from app.core.database import supabase
from fastapi import HTTPException
from app.services.activity_service import ActivityService

class CommentService:
    @staticmethod
    def create_comment(task_id: str, user_id: str, content: str):
        try:
            data = {
                "task_id": task_id,
                "user_id": user_id,
                "content": content
            }
            response = supabase.table("task_comments").insert(data).execute()
            ActivityService.log_activity(task_id, user_id, "added a comment", content)
            return response.data[0] if response.data else None
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_task_comments(task_id: str):
        try:
            # جلب التعليقات مرتبة من الأقدم للأحدث
            response = supabase.table("task_comments").select("*").eq("task_id", task_id).order("created_at", desc=False).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))