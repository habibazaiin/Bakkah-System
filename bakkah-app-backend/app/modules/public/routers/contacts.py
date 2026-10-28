from fastapi import APIRouter
# بنستدعي نفس الـ Schema والـ Service اللي عملناهم للأدمن عشان نوفر كود
from app.modules.admin.schemas.contacts import ContactResponse
from app.modules.admin.services.contacts import AdminContactService

# مسار عام للزوار بدون حماية
router = APIRouter(prefix="/public/contacts", tags=["Public Website"])

@router.get("/", response_model=list[ContactResponse])
async def get_public_contacts():
    """
    جلب جميع بيانات التواصل لعرضها في الموقع للزوار العاديين.
    هذا المسار متاح للجميع (بدون توثيق/تسجيل دخول).
    """
    return AdminContactService.get_all_contacts()