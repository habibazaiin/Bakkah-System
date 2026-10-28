from pydantic import BaseModel, EmailStr

class ContactUpdate(BaseModel):
    service_name: str
    email: EmailStr
    phone: str

class ContactResponse(BaseModel):
    service_name: str
    email: str
    phone: str