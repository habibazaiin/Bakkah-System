from fastapi import APIRouter, Depends
from app.modules.pmp.services.notification_service import NotificationService
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/members/notifications", tags=["Notifications"])

@router.get("/all")
async def get_notifications(current_user = Depends(get_current_user)):
    return NotificationService.get_user_notifications(current_user.id)

@router.patch("/read") # أو PUT لو بتستخدميها كده في الفرونت إند
async def mark_read(current_user = Depends(get_current_user)):
    return NotificationService.mark_notifications_read(current_user.id)

# 🌟 مسار المسح الجديد
@router.delete("/{notification_id}")
async def delete_notification(notification_id: str, current_user = Depends(get_current_user)):
    return NotificationService.delete_notification(notification_id, current_user.id)