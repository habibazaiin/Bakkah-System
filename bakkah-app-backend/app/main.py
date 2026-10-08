from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers.pmp import spaces
from app.api.routers.pmp import spaces, projects, tasks, comments, attachments, activities

app = FastAPI(title=settings.PROJECT_NAME)

# إعدادات الـ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spaces.router, prefix="/api/pmp")
app.include_router(projects.router, prefix="/api/pmp")
app.include_router(tasks.router, prefix="/api/pmp")
app.include_router(comments.router, prefix="/api/pmp/comments", tags=["Comments"])
app.include_router(attachments.router, prefix="/api/pmp/attachments", tags=["Attachments"])
app.include_router(activities.router, prefix="/api/pmp/activities", tags=["Activities"])

@app.get("/")
def root():
    return {"message": "Bakkah PMP API is running with Clean Architecture!"}