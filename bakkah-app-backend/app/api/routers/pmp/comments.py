from fastapi import APIRouter, Depends
from app.schemas.comment import CommentCreate
from app.services.comment_service import CommentService
from app.api.dependencies import get_current_user # تأكدي من مسار دالة التحقق من المستخدم

router = APIRouter()

@router.post("/")
async def add_comment(comment: CommentCreate, current_user = Depends(get_current_user)):
    # التعديل هنا: استخدمنا current_user.id بدل current_user["id"]
    return CommentService.create_comment(comment.task_id, current_user.id, comment.content)

@router.get("/{task_id}")
async def get_comments(task_id: str, current_user = Depends(get_current_user)):
    return CommentService.get_task_comments(task_id)