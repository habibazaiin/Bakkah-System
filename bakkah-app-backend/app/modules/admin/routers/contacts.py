from fastapi import APIRouter, Depends
from app.modules.admin.schemas.contacts import ContactUpdate, ContactResponse
from app.modules.admin.services.contacts import AdminContactService
from app.api.dependencies import require_admin_role

# وضعنا admin/contacts كـ prefix عشان المسار يكون نظيف
router = APIRouter(prefix="/admin/contacts", tags=["Admin Contacts"])

@router.get("/", response_model=list[ContactResponse])
async def get_contacts(admin_user = Depends(require_admin_role)):
    """جلب جميع بيانات التواصل (مخصصة للوحة تحكم الأدمن)"""
    return AdminContactService.get_all_contacts()

@router.post("/", response_model=ContactResponse)
async def update_service_contact(
    payload: ContactUpdate, 
    admin_user = Depends(require_admin_role)
):
    """إضافة أو تعديل بيانات خدمة معينة"""
    return AdminContactService.upsert_contact(
        service_name=payload.service_name,
        email=payload.email,
        phone=payload.phone
    )