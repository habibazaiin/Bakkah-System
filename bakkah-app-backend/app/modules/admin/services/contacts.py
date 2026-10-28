from app.core.database import supabase
from fastapi import HTTPException

class AdminContactService:
    @staticmethod
    def get_all_contacts():
        try:
            res = supabase.table("service_contacts").select("*").execute()
            return res.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def upsert_contact(service_name: str, email: str, phone: str):
        try:
            data = {
                "service_name": service_name,
                "email": email,
                "phone": phone
            }
            # يتم التحديث بناءً على اسم الخدمة (UNIQUE)
            res = supabase.table("service_contacts").upsert(
                data, on_conflict="service_name"
            ).execute()
            
            return res.data[0] if res.data else None
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))