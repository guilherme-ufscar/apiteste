from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db
from app.schemas.enrollment import EnrollmentCreate, EnrollmentPatch, EnrollmentRead
from app.schemas.grade import GradeCreate, GradeRead
from app.schemas.attendance import AttendanceCreate, AttendanceBulk, AttendanceRead
from app.crud import enrollment as crud

router = APIRouter()


@router.get("/", response_model=List[EnrollmentRead])
def list_enrollments(student_id: Optional[int] = None, subject_id: Optional[int] = None,
                     period_id: Optional[int] = None, status_filter: Optional[str] = None,
                     skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_multi(db, student_id=student_id, subject_id=subject_id, period_id=period_id, status=status_filter, skip=skip, limit=limit)


@router.post("/", response_model=EnrollmentRead, status_code=status.HTTP_201_CREATED)
def create_enrollment(data: EnrollmentCreate, db: Session = Depends(get_db)):
    try:
        return crud.create(db, data)
    except Exception:
        raise HTTPException(status_code=400, detail="Aluno já matriculado nessa disciplina/período")


@router.get("/{enrollment_id}", response_model=EnrollmentRead)
def get_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, enrollment_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")
    return obj


@router.patch("/{enrollment_id}", response_model=EnrollmentRead)
def patch_enrollment(enrollment_id: int, data: EnrollmentPatch, db: Session = Depends(get_db)):
    obj = crud.get(db, enrollment_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")
    return crud.patch(db, obj, data)


@router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, enrollment_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")
    crud.delete(db, obj)


@router.get("/{enrollment_id}/grades", response_model=List[GradeRead])
def get_grades(enrollment_id: int, db: Session = Depends(get_db)):
    return crud.get_grades(db, enrollment_id)


@router.post("/{enrollment_id}/grades", response_model=GradeRead, status_code=status.HTTP_201_CREATED)
def add_grade(enrollment_id: int, data: GradeCreate, db: Session = Depends(get_db)):
    obj = crud.get(db, enrollment_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")
    return crud.add_grade(db, enrollment_id, data)


@router.get("/{enrollment_id}/attendance", response_model=List[AttendanceRead])
def get_attendance(enrollment_id: int, db: Session = Depends(get_db)):
    return crud.get_attendance(db, enrollment_id)


@router.post("/{enrollment_id}/attendance", response_model=AttendanceRead, status_code=status.HTTP_201_CREATED)
def add_attendance(enrollment_id: int, data: AttendanceCreate, db: Session = Depends(get_db)):
    obj = crud.get(db, enrollment_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")
    return crud.add_attendance(db, enrollment_id, data)


@router.post("/attendance/bulk", response_model=List[AttendanceRead])
def bulk_attendance(data: AttendanceBulk, db: Session = Depends(get_db)):
    return crud.bulk_attendance(db, data)
