from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers.pmp import spaces
from app.api.routers.pmp import spaces, projects

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

@app.get("/")
def root():
    return {"message": "Bakkah PMP API is running with Clean Architecture!"}