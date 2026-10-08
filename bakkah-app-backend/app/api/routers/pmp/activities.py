from fastapi import APIRouter, Depends
from app.services.activity_service import ActivityService
from app.api.dependencies import get_current_user # اتأكدي من المسار

router = APIRouter()

@router.get("/{task_id}")
async def get_activities(task_id: str, current_user = Depends(get_current_user)):
    return ActivityService.get_task_activities(task_id)