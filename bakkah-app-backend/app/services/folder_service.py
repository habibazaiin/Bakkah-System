from fastapi import HTTPException
from app.core.database import supabase
from app.schemas.folder import FolderCreate, FolderUpdate

class FolderService:
    @staticmethod
    def create_folder(folder_data: FolderCreate):
        try:
            data = folder_data.model_dump()
            data["space_id"] = str(data["space_id"])
            response = supabase.table("folders").insert(data).execute()
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_space_folders(space_id: str):
        try:
            response = supabase.table("folders").select("*").eq("space_id", space_id).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    # 🌟 دالة التعديل الجديدة 🌟
    @staticmethod
    def update_folder(folder_id: str, folder_data: FolderUpdate):
        try:
            data = folder_data.model_dump(exclude_unset=True)
            if not data:
                raise HTTPException(status_code=400, detail="No data provided to update")
                
            response = supabase.table("folders").update(data).eq("id", folder_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Folder not found")
                
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete_folder(folder_id: str):
        try:
            supabase.table("folders").delete().eq("id", folder_id).execute()
            return True
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))