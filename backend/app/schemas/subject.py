from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.schemas.teacher import TeacherRead


class SubjectBase(BaseModel):
    name: str = Field(..., max_length=200)
    code: str = Field(..., max_length=20)
    description: Optional[str] = None
    workload_hours: int = 60
    teacher_id: Optional[int] = None


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(SubjectBase):
    pass


class SubjectPatch(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    workload_hours: Optional[int] = None
    teacher_id: Optional[int] = None


class SubjectRead(SubjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    teacher: Optional[TeacherRead] = None

    model_config = {"from_attributes": True}
