from pydantic import BaseModel
from datetime import date
from typing import Optional, List


class AttendanceBase(BaseModel):
    class_date: date
    present: bool
    notes: Optional[str] = None


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(AttendanceBase):
    pass


class AttendanceRead(AttendanceBase):
    id: int
    enrollment_id: int

    model_config = {"from_attributes": True}


class AttendanceBulkItem(BaseModel):
    enrollment_id: int
    present: bool


class AttendanceBulk(BaseModel):
    class_date: date
    records: List[AttendanceBulkItem]
    notes: Optional[str] = None
