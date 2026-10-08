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
            response = supabase.table("spaces").select("*").eq("owner_id", user_id).execute()
            return response.data
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