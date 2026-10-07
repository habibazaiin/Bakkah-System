from fastapi import APIRouter, Depends
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services.project_service import ProjectService
from app.api.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectResponse)
async def create_project(project: ProjectCreate, current_user = Depends(get_current_user)):
    return ProjectService.create_project(project, str(current_user.id))

# ضيفي ده تحت الـ POST اللي موجود
@router.get("/", response_model=List[ProjectResponse])
async def get_projects(current_user = Depends(get_current_user)):
    return ProjectService.get_projects(str(current_user.id))