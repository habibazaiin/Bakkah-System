from app.core.database import supabase
from fastapi import HTTPException

class FurnitureService:
    @staticmethod
    def get_all_items():
        try:
            res = supabase.table("furniture_portfolio").select("*").order("created_at", desc=True).execute()
            return res.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def add_item(data: dict):
        try:
            res = supabase.table("furniture_portfolio").insert(data).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete_item(item_id: str):
        try:
            supabase.table("furniture_portfolio").delete().eq("id", item_id).execute()
            return True
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update_item(item_id: str, data: dict):
        try:
            res = supabase.table("furniture_portfolio").update(data).eq("id", item_id).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))