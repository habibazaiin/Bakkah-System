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
            # 1. نجيب كل الـ Spaces اللي اليوزر ليه صلاحية عليها (سواء مالك أو عضو)
            owner_spaces = supabase.table("spaces").select("id").eq("owner_id", user_id).execute().data
            member_spaces = supabase.table("space_members").select("space_id").eq("user_id", user_id).execute().data
            
            valid_space_ids = [s["id"] for s in owner_spaces] + [m["space_id"] for m in member_spaces]
            
            if not valid_space_ids:
                return []
                
            # 2. نجيب كل المشاريع اللي جوه الـ Spaces دي فقط
            response = supabase.table("projects").select("*").in_("space_id", valid_space_ids).execute()
            return response.data
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update_project(project_id: str, project_data: dict):
        try:
            # شيلنا سطر الـ import الغلط من هنا
            response = supabase.table("projects").update(project_data).eq("id", project_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))


    @staticmethod
    def delete_project(project_id: str):
        try:
            # الداتابيز هتمسح المشروع وكل التأسكات اللي جواه أوتوماتيك (بسبب الـ CASCADE)
            response = supabase.table("projects").delete().eq("id", project_id).execute()
            return True
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))