from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers.pmp import spaces, projects, tasks, comments, attachments, activities, folders, members, teams, notifications
from contextlib import asynccontextmanager
from app.core.scheduler import scheduler

# 🌟 تشغيل المنبه مع بداية السيرفر وإيقافه مع القفل
@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    yield
    scheduler.shutdown()

# تمرير الـ lifespan لتطبيق FastAPI
app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spaces.router, prefix="/api/pmp")
app.include_router(folders.router, prefix="/api/pmp") 
app.include_router(projects.router, prefix="/api/pmp")
app.include_router(tasks.router, prefix="/api/pmp")
app.include_router(comments.router, prefix="/api/pmp")
app.include_router(attachments.router, prefix="/api/pmp/attachments", tags=["Attachments"])
app.include_router(activities.router, prefix="/api/pmp")
app.include_router(notifications.router, prefix="/api/pmp") # 🌟 ضفنا راوتر الإشعارات هنا
app.include_router(members.router, prefix="/api/pmp")
app.include_router(teams.router, prefix="/api/pmp")


@app.get("/")
def root():
    return {"message": "Bakkah PMP API is running with Clean Architecture!"}