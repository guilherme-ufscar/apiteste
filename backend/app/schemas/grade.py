from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from decimal import Decimal


class GradeBase(BaseModel):
    grade_type: str = Field(..., max_length=50)
    value: Decimal = Field(..., ge=0, le=10)
    notes: Optional[str] = None


class GradeCreate(GradeBase):
    pass


class GradeUpdate(GradeBase):
    pass


class GradeRead(GradeBase):
    id: int
    enrollment_id: int
    graded_at: datetime

    model_config = {"from_attributes": True}
