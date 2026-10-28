from pydantic import BaseModel

class FurnitureCreate(BaseModel):
    title: str
    description: str
    image_url: str

class FurnitureResponse(FurnitureCreate):
    id: str