from fastapi import APIRouter, Depends
from app.modules.admin.schemas.furniture import FurnitureCreate, FurnitureResponse
from app.modules.admin.services.furniture import FurnitureService
from app.api.dependencies import require_admin_role

router = APIRouter(prefix="/admin/furniture", tags=["Admin Furniture"])

@router.post("/", response_model=FurnitureResponse)
async def create_furniture_item(payload: FurnitureCreate, admin_user = Depends(require_admin_role)):
    return FurnitureService.add_item(payload.dict())

@router.delete("/{item_id}")
async def delete_furniture_item(item_id: str, admin_user = Depends(require_admin_role)):
    FurnitureService.delete_item(item_id)
    return {"message": "Item deleted successfully"}

@router.put("/{item_id}", response_model=FurnitureResponse)
async def update_furniture_item(item_id: str, payload: FurnitureCreate, admin_user = Depends(require_admin_role)):
    return FurnitureService.update_item(item_id, payload.dict())