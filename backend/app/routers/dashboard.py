from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.dependencies import get_db
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.subject import Subject
from app.models.enrollment import Enrollment
from app.models.grade import Grade

router = APIRouter()


@router.get("/stats")
def get_stats(period_id: Optional[int] = None, db: Session = Depends(get_db)):
    total_students = db.query(func.count(Student.id)).filter(Student.is_active == True).scalar()
    total_teachers = db.query(func.count(Teacher.id)).filter(Teacher.is_active == True).scalar()
    total_subjects = db.query(func.count(Subject.id)).scalar()

    enroll_q = db.query(Enrollment)
    grade_q = db.query(Grade)

    if period_id:
        enroll_q = enroll_q.filter(Enrollment.period_id == period_id)
        grade_q = grade_q.join(Enrollment).filter(Enrollment.period_id == period_id)

    active_enrollments = enroll_q.filter(Enrollment.status == "active").count()
    avg_grade = db.query(func.avg(Grade.value)).scalar()
    avg_grade = float(avg_grade) if avg_grade else None

    # Pass rate: average >= 6.0
    total_graded = db.query(Enrollment.id).join(Grade).distinct().count()
    passing = 0
    if total_graded:
        subq = db.query(Enrollment.id, func.avg(Grade.value).label("avg")).join(Grade).group_by(Enrollment.id).subquery()
        passing = db.query(func.count()).filter(subq.c.avg >= 6.0).scalar() or 0

    pass_rate = passing / total_graded if total_graded else None

    # Recent enrollments
    recent = db.query(Enrollment).options(
        __import__('sqlalchemy.orm', fromlist=['joinedload']).joinedload(Enrollment.student),
        __import__('sqlalchemy.orm', fromlist=['joinedload']).joinedload(Enrollment.subject),
    ).order_by(Enrollment.enrolled_at.desc()).limit(5).all()

    recent_list = [
        {"id": e.id, "student": e.student.name, "subject": e.subject.name, "enrolled_at": e.enrolled_at.isoformat()}
        for e in recent
    ]

    # Grades by subject
    grades_by_subject = db.query(
        Subject.name,
        func.avg(Grade.value).label("avg"),
        func.count(Grade.id).label("count"),
    ).join(Enrollment, Enrollment.subject_id == Subject.id).join(Grade).group_by(Subject.id, Subject.name).all()

    grades_by_subject_list = [
        {"subject": r.name, "average": round(float(r.avg), 2), "count": r.count}
        for r in grades_by_subject
    ]

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_subjects": total_subjects,
        "active_enrollments": active_enrollments,
        "average_grade": round(avg_grade, 2) if avg_grade else None,
        "pass_rate": round(pass_rate, 2) if pass_rate else None,
        "recent_enrollments": recent_list,
        "grades_by_subject": grades_by_subject_list,
    }
