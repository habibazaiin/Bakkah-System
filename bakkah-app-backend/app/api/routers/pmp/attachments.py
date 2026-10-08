from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.services.attachment_service import AttachmentService
from app.api.dependencies import get_current_user # تأكدي من المسار ده

router = APIRouter()

@router.post("/")
async def upload_file(
    task_id: str = Form(...),
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    # بنستخدم الـ Form عشان نستقبل الـ task_id مع الـ File في نفس الطلب
    return await AttachmentService.upload_attachment(task_id, current_user.id, file)

@router.get("/{task_id}")
async def get_attachments(task_id: str, current_user = Depends(get_current_user)):
    return AttachmentService.get_task_attachments(task_id)