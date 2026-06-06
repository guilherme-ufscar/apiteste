from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.dependencies import get_db
from app.schemas.student import StudentCreate, StudentUpdate, StudentPatch, StudentRead
from app.schemas.enrollment import EnrollmentRead
from app.schemas.grade import GradeRead
from app.models.enrollment import Enrollment
from app.models.grade import Grade
from app.models.attendance import Attendance
from app.crud import student as crud

router = APIRouter()


@router.get("/", response_model=List[StudentRead])
def list_students(name: Optional[str] = None, is_active: Optional[bool] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_multi(db, name=name, is_active=is_active, skip=skip, limit=limit)


@router.post("/", response_model=StudentRead, status_code=status.HTTP_201_CREATED)
def create_student(data: StudentCreate, db: Session = Depends(get_db)):
    if crud.get_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return crud.create(db, data)


@router.get("/{student_id}", response_model=StudentRead)
def get_student(student_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, student_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return obj


@router.put("/{student_id}", response_model=StudentRead)
def update_student(student_id: int, data: StudentUpdate, db: Session = Depends(get_db)):
    obj = crud.get(db, student_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return crud.update(db, obj, data)


@router.patch("/{student_id}", response_model=StudentRead)
def patch_student(student_id: int, data: StudentPatch, db: Session = Depends(get_db)):
    obj = crud.get(db, student_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return crud.patch(db, obj, data)


@router.delete("/{student_id}", response_model=StudentRead)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, student_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return crud.delete(db, obj)


@router.get("/{student_id}/enrollments", response_model=List[EnrollmentRead])
def student_enrollments(student_id: int, db: Session = Depends(get_db)):
    return db.query(Enrollment).options(
        joinedload(Enrollment.subject).joinedload("teacher"),
        joinedload(Enrollment.period),
    ).filter(Enrollment.student_id == student_id).all()


@router.get("/{student_id}/grades", response_model=List[GradeRead])
def student_grades(student_id: int, db: Session = Depends(get_db)):
    return db.query(Grade).join(Enrollment).filter(Enrollment.student_id == student_id).all()


@router.get("/{student_id}/report-card")
def student_report_card(student_id: int, period_id: Optional[int] = None, db: Session = Depends(get_db)):
    obj = crud.get(db, student_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")

    q = db.query(Enrollment).options(
        joinedload(Enrollment.subject),
        joinedload(Enrollment.period),
        joinedload(Enrollment.grades),
        joinedload(Enrollment.attendance_records),
    ).filter(Enrollment.student_id == student_id)

    if period_id:
        q = q.filter(Enrollment.period_id == period_id)

    enrollments = q.all()
    report = []
    for e in enrollments:
        grades = {g.grade_type: float(g.value) for g in e.grades}
        avg = sum(grades.values()) / len(grades) if grades else None
        total_classes = len(e.attendance_records)
        present_count = sum(1 for a in e.attendance_records if a.present)
        attendance_rate = present_count / total_classes if total_classes else None

        report.append({
            "enrollment_id": e.id,
            "subject": {"id": e.subject.id, "name": e.subject.name, "code": e.subject.code},
            "period": {"id": e.period.id, "name": e.period.name},
            "status": e.status,
            "grades": grades,
            "average_grade": round(avg, 2) if avg is not None else None,
            "passed": avg >= 6.0 if avg is not None else None,
            "total_classes": total_classes,
            "present_count": present_count,
            "attendance_rate": round(attendance_rate, 2) if attendance_rate is not None else None,
        })

    return {
        "student": {"id": obj.id, "name": obj.name, "email": obj.email, "registration": obj.registration},
        "report": report,
    }
