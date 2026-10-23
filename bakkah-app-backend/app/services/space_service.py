from fastapi import HTTPException
from app.core.database import supabase
from app.schemas.space import SpaceCreate, SpaceUpdate

class SpaceService:
    @staticmethod
    def create_space(space_data: SpaceCreate, user_id: str):
        try:
            data = space_data.model_dump()
            data["owner_id"] = user_id
            
            response = supabase.table("spaces").insert(data).execute()
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_spaces(user_id: str):
        try:
            owner_spaces_res = supabase.table("spaces").select("*").eq("owner_id", user_id).execute()
            owner_spaces = owner_spaces_res.data
            
            memberships_res = supabase.table("space_members").select("space_id").eq("user_id", user_id).execute()
            member_space_ids = [m["space_id"] for m in memberships_res.data]
            
            member_spaces = []
            if member_space_ids:
                member_spaces_res = supabase.table("spaces").select("*").in_("id", member_space_ids).execute()
                member_spaces = member_spaces_res.data
                
            all_spaces = {s["id"]: s for s in owner_spaces + member_spaces}.values()
            return list(all_spaces)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    # 🌟 دالة التعديل الجديدة 🌟
    @staticmethod
    def update_space(space_id: str, space_data: SpaceUpdate):
        try:
            # exclude_unset=True عشان نبعت بس الحقول اللي اتغيرت وموجودة في الـ Request
            data = space_data.model_dump(exclude_unset=True)
            if not data:
                raise HTTPException(status_code=400, detail="No data provided to update")
                
            response = supabase.table("spaces").update(data).eq("id", space_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Space not found")
                
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete_space(space_id: str):
        try:
            response = supabase.table("spaces").delete().eq("id", space_id).execute()
            return True
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))