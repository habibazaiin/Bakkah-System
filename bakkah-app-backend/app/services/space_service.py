# app/services/space_service.py
from fastapi import HTTPException
from app.core.database import supabase
from app.schemas.space import SpaceCreate

class SpaceService:
    @staticmethod
    def create_space(space_data: SpaceCreate, user_id: str):
        try:
            data = space_data.model_dump()
            data["owner_id"] = user_id
            
            response = supabase.table("spaces").insert(data).execute()
            return response.data[0]
        except Exception as e:
            # ده هيرجعلنا تفاصيل الإيرور بالظبط بدل 500
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_spaces(user_id: str):
        try:
            # 1. جلب الـ Spaces اللي المستخدم هو المالك بتاعها
            owner_spaces_res = supabase.table("spaces").select("*").eq("owner_id", user_id).execute()
            owner_spaces = owner_spaces_res.data
            
            # 2. جلب الـ Spaces اللي المستخدم متضاف فيها كعضو
            memberships_res = supabase.table("space_members").select("space_id").eq("user_id", user_id).execute()
            member_space_ids = [m["space_id"] for m in memberships_res.data]
            
            member_spaces = []
            if member_space_ids:
                # جلب بيانات المساحات دي
                member_spaces_res = supabase.table("spaces").select("*").in_("id", member_space_ids).execute()
                member_spaces = member_spaces_res.data
                
            # 3. دمج الاتنين مع بعض بدون تكرار
            all_spaces = {s["id"]: s for s in owner_spaces + member_spaces}.values()
            
            return list(all_spaces)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete_space(space_id: str):
        try:
            # مسح الـ Space (وبفضل الـ CASCADE في الداتابيز، كل المشاريع والمهام اللي جواه هتتمسح أوتوماتيك)
            response = supabase.table("spaces").delete().eq("id", space_id).execute()
            return True
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))