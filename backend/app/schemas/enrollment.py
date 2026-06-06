from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.student import StudentRead
from app.schemas.subject import SubjectRead
from app.schemas.period import PeriodRead


class EnrollmentBase(BaseModel):
    student_id: int
    subject_id: int
    period_id: int
    status: str = "active"


class EnrollmentCreate(EnrollmentBase):
    pass


class EnrollmentPatch(BaseModel):
    status: Optional[str] = None


class EnrollmentRead(EnrollmentBase):
    id: int
    enrolled_at: datetime
    student: Optional[StudentRead] = None
    subject: Optional[SubjectRead] = None
    period: Optional[PeriodRead] = None

    model_config = {"from_attributes": True}
