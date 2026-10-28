from fastapi import APIRouter
from app.modules.admin.schemas.furniture import FurnitureResponse
from app.modules.admin.services.furniture import FurnitureService

router = APIRouter(prefix="/public/furniture", tags=["Public Furniture"])

@router.get("/", response_model=list[FurnitureResponse])
async def get_public_furniture():
    return FurnitureService.get_all_items()