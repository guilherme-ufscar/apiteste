from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.models.period import Period
from app.models.enrollment import Enrollment
from app.schemas.period import PeriodCreate, PeriodUpdate, PeriodPatch


def get_multi(db: Session, is_active: Optional[bool] = None, skip: int = 0, limit: int = 100):
    q = db.query(Period)
    if is_active is not None:
        q = q.filter(Period.is_active == is_active)
    return q.order_by(Period.year.desc(), Period.semester.desc()).offset(skip).limit(limit).all()


def get(db: Session, period_id: int):
    return db.query(Period).filter(Period.id == period_id).first()


def create(db: Session, data: PeriodCreate):
    obj = Period(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update(db: Session, period: Period, data: PeriodUpdate):
    for field, value in data.model_dump().items():
        setattr(period, field, value)
    db.commit()
    db.refresh(period)
    return period


def patch(db: Session, period: Period, data: PeriodPatch):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(period, field, value)
    db.commit()
    db.refresh(period)
    return period


def delete(db: Session, period: Period):
    db.delete(period)
    db.commit()


def get_stats(db: Session, period_id: int):
    from app.models.grade import Grade
    enrollments = db.query(Enrollment).filter(Enrollment.period_id == period_id).all()
    student_ids = {e.student_id for e in enrollments}
    subject_ids = {e.subject_id for e in enrollments}
    enrollment_ids = [e.id for e in enrollments]

    avg = None
    if enrollment_ids:
        avg_result = db.query(func.avg(Grade.value)).filter(Grade.enrollment_id.in_(enrollment_ids)).scalar()
        avg = float(avg_result) if avg_result else None

    return {
        "total_students": len(student_ids),
        "total_subjects": len(subject_ids),
        "total_enrollments": len(enrollments),
        "average_grade": avg,
    }
