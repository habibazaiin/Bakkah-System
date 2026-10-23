from fastapi import APIRouter, Depends
from typing import List
from app.schemas.space import SpaceCreate, SpaceResponse, SpaceUpdate
from app.services.space_service import SpaceService
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/spaces", tags=["Spaces"])

@router.post("/", response_model=SpaceResponse)
async def create_space(space: SpaceCreate, current_user = Depends(get_current_user)):
    return SpaceService.create_space(space, str(current_user.id))

@router.get("/", response_model=List[SpaceResponse])
async def get_spaces(current_user = Depends(get_current_user)):
    return SpaceService.get_spaces(str(current_user.id))

# 🌟 الـ Endpoint الجديدة للتعديل 🌟
@router.patch("/{space_id}", response_model=SpaceResponse)
async def update_space(space_id: str, space: SpaceUpdate, current_user = Depends(get_current_user)):
    return SpaceService.update_space(space_id, space)

@router.delete("/{space_id}")
async def delete_space(space_id: str, current_user = Depends(get_current_user)):
    SpaceService.delete_space(space_id)
    return {"message": "Space deleted successfully"}