from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional


class TeacherBase(BaseModel):
    name: str = Field(..., max_length=200)
    email: EmailStr
    cpf: Optional[str] = None
    phone: Optional[str] = None
    hire_date: Optional[date] = None
    is_active: bool = True


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(TeacherBase):
    pass


class TeacherPatch(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    cpf: Optional[str] = None
    phone: Optional[str] = None
    hire_date: Optional[date] = None
    is_active: Optional[bool] = None


class TeacherRead(TeacherBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
