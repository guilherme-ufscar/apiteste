from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.models.enrollment import Enrollment
from app.models.grade import Grade
from app.models.attendance import Attendance
from app.schemas.enrollment import EnrollmentCreate, EnrollmentPatch
from app.schemas.grade import GradeCreate
from app.schemas.attendance import AttendanceCreate, AttendanceBulk


def get_multi(db: Session, student_id: Optional[int] = None, subject_id: Optional[int] = None,
              period_id: Optional[int] = None, status: Optional[str] = None, skip: int = 0, limit: int = 100):
    q = db.query(Enrollment).options(
        joinedload(Enrollment.student),
        joinedload(Enrollment.subject).joinedload("teacher"),
        joinedload(Enrollment.period),
    )
    if student_id:
        q = q.filter(Enrollment.student_id == student_id)
    if subject_id:
        q = q.filter(Enrollment.subject_id == subject_id)
    if period_id:
        q = q.filter(Enrollment.period_id == period_id)
    if status:
        q = q.filter(Enrollment.status == status)
    return q.offset(skip).limit(limit).all()


def get(db: Session, enrollment_id: int):
    return db.query(Enrollment).options(
        joinedload(Enrollment.student),
        joinedload(Enrollment.subject).joinedload("teacher"),
        joinedload(Enrollment.period),
    ).filter(Enrollment.id == enrollment_id).first()


def create(db: Session, data: EnrollmentCreate):
    obj = Enrollment(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return get(db, obj.id)


def patch(db: Session, enrollment: Enrollment, data: EnrollmentPatch):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(enrollment, field, value)
    db.commit()
    return get(db, enrollment.id)


def delete(db: Session, enrollment: Enrollment):
    db.delete(enrollment)
    db.commit()


def get_grades(db: Session, enrollment_id: int):
    return db.query(Grade).filter(Grade.enrollment_id == enrollment_id).all()


def add_grade(db: Session, enrollment_id: int, data: GradeCreate):
    existing = db.query(Grade).filter(
        Grade.enrollment_id == enrollment_id,
        Grade.grade_type == data.grade_type
    ).first()
    if existing:
        existing.value = data.value
        existing.notes = data.notes
        db.commit()
        db.refresh(existing)
        return existing
    obj = Grade(enrollment_id=enrollment_id, **data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_attendance(db: Session, enrollment_id: int):
    return db.query(Attendance).filter(Attendance.enrollment_id == enrollment_id).order_by(Attendance.class_date).all()


def add_attendance(db: Session, enrollment_id: int, data: AttendanceCreate):
    existing = db.query(Attendance).filter(
        Attendance.enrollment_id == enrollment_id,
        Attendance.class_date == data.class_date
    ).first()
    if existing:
        existing.present = data.present
        existing.notes = data.notes
        db.commit()
        db.refresh(existing)
        return existing
    obj = Attendance(enrollment_id=enrollment_id, **data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def bulk_attendance(db: Session, data: AttendanceBulk):
    results = []
    for item in data.records:
        existing = db.query(Attendance).filter(
            Attendance.enrollment_id == item.enrollment_id,
            Attendance.class_date == data.class_date
        ).first()
        if existing:
            existing.present = item.present
            existing.notes = data.notes
            results.append(existing)
        else:
            obj = Attendance(enrollment_id=item.enrollment_id, class_date=data.class_date, present=item.present, notes=data.notes)
            db.add(obj)
            results.append(obj)
    db.commit()
    return results
