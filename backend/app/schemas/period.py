from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class PeriodBase(BaseModel):
    name: str = Field(..., max_length=100)
    year: int
    semester: int = Field(..., ge=1, le=2)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool = False


class PeriodCreate(PeriodBase):
    pass


class PeriodUpdate(PeriodBase):
    pass


class PeriodPatch(BaseModel):
    name: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = Field(None, ge=1, le=2)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None


class PeriodRead(PeriodBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PeriodStats(BaseModel):
    period_id: int
    period_name: str
    total_students: int
    total_subjects: int
    total_enrollments: int
    average_grade: Optional[float]
