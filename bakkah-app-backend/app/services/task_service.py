from fastapi import HTTPException
from app.core.database import supabase
from app.schemas.task import TaskCreate, TaskUpdate

class TaskService:
    @staticmethod
    def create_task(task: TaskCreate, user_id: str):
        try:
            data = task.model_dump()
            data["created_by"] = user_id
            data["project_id"] = str(data["project_id"])
            
            if data.get("parent_task_id"):
                data["parent_task_id"] = str(data["parent_task_id"])
            
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
            response = supabase.table("tasks").select("*").eq("project_id", project_id).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update_task(task_id: str, task_data):
        try:
            # لو الداتا جاية كـ dict جاهز، هناخدها زي ما هي
            # لو جاية كـ Pydantic Model، هنحولها
            if isinstance(task_data, dict):
                update_data = task_data
            else:
                update_data = task_data.model_dump(exclude_unset=True)

            print(f"🚀 DATA GOING TO SUPABASE: {update_data}")
            
            if not update_data:
                return {"message": "No data to update"}
                
            response = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
            
            if not response.data:
                from fastapi import HTTPException
                raise HTTPException(status_code=404, detail="Task not found")
                
            return response.data[0]
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