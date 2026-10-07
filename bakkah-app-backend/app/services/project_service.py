from fastapi import HTTPException
from app.core.database import supabase
from app.schemas.project import ProjectCreate

class ProjectService:
    @staticmethod
    def create_project(project: ProjectCreate, user_id: str):
        try:
            data = project.model_dump()
            data["owner_id"] = user_id
            
            # تحويل الـ UUID لـ Strings عشان Supabase يقبلها
            data["space_id"] = str(data["space_id"])
            if data["folder_id"]:
                data["folder_id"] = str(data["folder_id"])
                
            response = supabase.table("projects").insert(data).execute()
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_projects(user_id: str):
        try:
            # هنجيب كل المشاريع الخاصة باليوزر ده
            response = supabase.table("projects").select("*").eq("owner_id", user_id).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))