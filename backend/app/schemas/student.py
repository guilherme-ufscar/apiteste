from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional


class StudentBase(BaseModel):
    name: str = Field(..., max_length=200)
    email: EmailStr
    cpf: Optional[str] = None
    birth_date: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    registration: Optional[str] = None
    is_active: bool = True


class StudentCreate(StudentBase):
    pass


class StudentUpdate(StudentBase):
    pass


class StudentPatch(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    cpf: Optional[str] = None
    birth_date: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    registration: Optional[str] = None
    is_active: Optional[bool] = None


class StudentRead(StudentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
