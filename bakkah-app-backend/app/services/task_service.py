from fastapi import HTTPException
from app.core.database import supabase
from app.schemas.task import TaskCreate

class TaskService:
    @staticmethod
    def create_task(task: TaskCreate, user_id: str):
        try:
            data = task.model_dump()
            data["created_by"] = user_id
            data["project_id"] = str(data["project_id"])
            
            # تحويل التواريخ لنص عشان Supabase يقبلها
            if data.get("start_date"):
                data["start_date"] = data["start_date"].isoformat()
            if data.get("due_date"):
                data["due_date"] = data["due_date"].isoformat()

            response = supabase.table("tasks").insert(data).execute()
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_tasks(project_id: str):
        try:
            # هنجيب كل المهام المرتبطة بمشروع معين
            response = supabase.table("tasks").select("*").eq("project_id", project_id).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update_task(task_id: str, task_data: dict):
        try:
            from datetime import datetime, date
            task_data["updated_at"] = datetime.utcnow().isoformat()
            
            # السطرين دول هم الحل: بيحولوا التاريخ لنص عشان الداتابيز تقبله
            if "start_date" in task_data and isinstance(task_data["start_date"], date):
                task_data["start_date"] = task_data["start_date"].isoformat()
            if "due_date" in task_data and isinstance(task_data["due_date"], date):
                task_data["due_date"] = task_data["due_date"].isoformat()
            
            response = supabase.table("tasks").update(task_data).eq("id", task_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete_task(task_id: str):
        try:
            response = supabase.table("tasks").delete().eq("id", task_id).execute()
            return True
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))