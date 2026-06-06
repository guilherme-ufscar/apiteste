from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
from app.dependencies import get_db
from app.models.enrollment import Enrollment
from app.models.grade import Grade
from app.models.attendance import Attendance
from app.models.student import Student
from app.models.subject import Subject

router = APIRouter()


@router.get("/grade-summary")
def grade_summary(period_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(
        Student.id.label("student_id"),
        Student.name.label("student_name"),
        Student.registration,
        Subject.name.label("subject_name"),
        Subject.code,
        func.avg(Grade.value).label("average"),
    ).join(Enrollment, Enrollment.student_id == Student.id)\
     .join(Subject, Subject.id == Enrollment.subject_id)\
     .join(Grade, Grade.enrollment_id == Enrollment.id)\
     .group_by(Student.id, Student.name, Student.registration, Subject.name, Subject.code)

    if period_id:
        q = q.filter(Enrollment.period_id == period_id)

    return [
        {
            "student_id": r.student_id,
            "student_name": r.student_name,
            "registration": r.registration,
            "subject": r.subject_name,
            "code": r.code,
            "average": round(float(r.average), 2),
            "passed": float(r.average) >= 6.0,
        }
        for r in q.all()
    ]


@router.get("/failing-students")
def failing_students(period_id: Optional[int] = None, threshold: float = 6.0, db: Session = Depends(get_db)):
    subq = db.query(
        Enrollment.id.label("enrollment_id"),
        Enrollment.student_id,
        Enrollment.subject_id,
        func.avg(Grade.value).label("avg"),
    ).join(Grade).group_by(Enrollment.id, Enrollment.student_id, Enrollment.subject_id)

    if period_id:
        subq = subq.filter(Enrollment.period_id == period_id)

    subq = subq.subquery()

    results = db.query(subq).filter(subq.c.avg < threshold).all()

    failing = []
    for r in results:
        student = db.query(Student).get(r.student_id)
        subject = db.query(Subject).get(r.subject_id)
        failing.append({
            "student": student.name if student else None,
            "subject": subject.name if subject else None,
            "average": round(float(r.avg), 2),
        })
    return failing


@router.get("/attendance-summary")
def attendance_summary(period_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(
        Student.name.label("student_name"),
        Subject.name.label("subject_name"),
        func.count(Attendance.id).label("total"),
        func.sum(Attendance.present.cast(__import__('sqlalchemy').Integer)).label("present"),
    ).join(Enrollment, Enrollment.student_id == Student.id)\
     .join(Subject, Subject.id == Enrollment.subject_id)\
     .join(Attendance, Attendance.enrollment_id == Enrollment.id)\
     .group_by(Student.name, Subject.name)

    if period_id:
        q = q.filter(Enrollment.period_id == period_id)

    return [
        {
            "student": r.student_name,
            "subject": r.subject_name,
            "total_classes": r.total,
            "present": int(r.present or 0),
            "attendance_rate": round(int(r.present or 0) / r.total, 2) if r.total else 0,
        }
        for r in q.all()
    ]
