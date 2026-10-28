from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.modules.admin.routers import furniture as admin_furniture_router
from app.modules.public.routers import furniture as public_furniture_router

# Core Imports
from app.core.config import settings
from app.core.scheduler import scheduler

# PMP Routers
from app.modules.pmp.routers import (
    activities, attachments, comments, members, 
    notifications, projects, spaces, tasks, teams, folders
)

# Admin & Public Routers
from app.modules.admin.routers import contacts as admin_contacts_router
from app.modules.public.routers import contacts as public_contacts_router # 🌟 استدعينا الراوتر العام الجديد

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

# ==========================================
# 1. PMP Routes (نظام إدارة المشاريع)
# ==========================================
app.include_router(spaces.router, prefix="/api/pmp")
app.include_router(folders.router, prefix="/api/pmp") 
app.include_router(projects.router, prefix="/api/pmp")
app.include_router(tasks.router, prefix="/api/pmp")
app.include_router(comments.router, prefix="/api/pmp")
app.include_router(attachments.router, prefix="/api/pmp/attachments", tags=["Attachments"])
app.include_router(activities.router, prefix="/api/pmp")
app.include_router(notifications.router, prefix="/api/pmp")
app.include_router(members.router, prefix="/api/pmp")
app.include_router(teams.router, prefix="/api/pmp")

# ==========================================
# 2. Admin Routes (لوحة تحكم الإدارة)
# ==========================================
# ضفنا prefix="/api" عشان المسار النهائي يكون: /api/admin/contacts
app.include_router(admin_contacts_router.router, prefix="/api")

# ==========================================
# 3. Public Routes (مسارات الموقع العام للزوار)
# ==========================================
# ضفنا prefix="/api" عشان المسار النهائي يكون: /api/public/contacts
app.include_router(public_contacts_router.router, prefix="/api")

app.include_router(admin_furniture_router.router, prefix="/api")
app.include_router(public_furniture_router.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Bakkah API is running with Clean Architecture!"}