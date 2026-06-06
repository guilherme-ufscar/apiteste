from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceUpdate


def get(db: Session, attendance_id: int):
    return db.query(Attendance).filter(Attendance.id == attendance_id).first()


def update(db: Session, attendance: Attendance, data: AttendanceUpdate):
    for field, value in data.model_dump().items():
        setattr(attendance, field, value)
    db.commit()
    db.refresh(attendance)
    return attendance


def delete(db: Session, attendance: Attendance):
    db.delete(attendance)
    db.commit()
