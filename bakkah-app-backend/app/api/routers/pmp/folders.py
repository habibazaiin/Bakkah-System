from fastapi import APIRouter, Depends
from typing import List
from app.schemas.folder import FolderCreate, FolderResponse
from app.services.folder_service import FolderService
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/folders", tags=["Folders"])

@router.post("/", response_model=FolderResponse)
async def create_folder(folder: FolderCreate, current_user = Depends(get_current_user)):
    return FolderService.create_folder(folder)

@router.get("/{space_id}", response_model=List[FolderResponse])
async def get_space_folders(space_id: str, current_user = Depends(get_current_user)):
    return FolderService.get_space_folders(space_id)

@router.delete("/{folder_id}")
async def delete_folder(folder_id: str, current_user = Depends(get_current_user)):
    FolderService.delete_folder(folder_id)
    return {"message": "Folder deleted successfully"}