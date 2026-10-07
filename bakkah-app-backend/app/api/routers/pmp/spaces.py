# app/api/routers/spaces.py
from fastapi import APIRouter, Depends
from typing import List
from app.schemas.space import SpaceCreate, SpaceResponse
from app.services.space_service import SpaceService
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/spaces", tags=["Spaces"])

@router.post("/", response_model=SpaceResponse)
async def create_space(space: SpaceCreate, current_user = Depends(get_current_user)):
    return SpaceService.create_space(space, str(current_user.id))

@router.get("/", response_model=List[SpaceResponse])
async def get_spaces(current_user = Depends(get_current_user)):
    return SpaceService.get_spaces(str(current_user.id))