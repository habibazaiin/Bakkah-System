from app.core.database import supabase
from fastapi import HTTPException
from app.modules.pmp.services.activity_service import ActivityService

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
            
            new_comment = response.data[0] if response.data else None
            
            # عشان لما نضيف كومنت جديد يرجع ببيانات اليوزر فوراً والفرونت إند يعرضه بالاسم
            if new_comment:
                profile_res = supabase.table("profiles").select("id, username, email").eq("id", user_id).execute()
                new_comment["profiles"] = profile_res.data[0] if profile_res.data else {}
                
            return new_comment
        except Exception as e:
            import traceback
            print(f"🔥 COMMENTS ERROR: {str(e)}")
            traceback.print_exc() # ده هيطبع تفاصيل الإيرور بالكامل
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_task_comments(task_id: str):
        try:
            # 1. جلب التعليقات مرتبة
            res = supabase.table("task_comments").select("*").eq("task_id", task_id).order("created_at").execute()
            comments = res.data
            if not comments:
                return []

            # 2. تجميع معرفات المستخدمين
            user_ids = list(set([c["user_id"] for c in comments if c.get("user_id")]))
            
            # 3. جلب بيانات البروفايل ودمجها (Manual Join)
            if user_ids:
                profiles_res = supabase.table("profiles").select("id, username, email").in_("id", user_ids).execute()
                profiles_map = {p["id"]: p for p in profiles_res.data}
                
                for c in comments:
                    user_id = c.get("user_id")
                    c["profiles"] = profiles_map.get(user_id, {})
                    
            return comments
        except Exception as e:
            import traceback
            print(f"🔥 COMMENTS ERROR: {str(e)}")
            traceback.print_exc() # ده هيطبع تفاصيل الإيرور بالكامل
            raise HTTPException(status_code=400, detail=str(e))


    @staticmethod
    def delete_comment(comment_id: str, user_id: str):
        try:
            # التحقق من أن التعليق يخص المستخدم (اختياري حسب الـ Business Logic)
            comment_res = supabase.table("task_comments").select("*").eq("id", comment_id).execute()
            if not comment_res.data:
                raise HTTPException(status_code=404, detail="Comment not found")
                
            task_id = comment_res.data[0]["task_id"]
            
            supabase.table("task_comments").delete().eq("id", comment_id).execute()
            ActivityService.log_activity(task_id, user_id, "deleted a comment", "")
            return {"message": "Comment deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))