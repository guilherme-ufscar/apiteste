from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectPatch, SubjectRead
from app.schemas.enrollment import EnrollmentRead
from app.schemas.grade import GradeRead
from app.models.enrollment import Enrollment
from app.models.grade import Grade
from app.crud import subject as crud

router = APIRouter()


@router.get("/", response_model=List[SubjectRead])
def list_subjects(name: Optional[str] = None, code: Optional[str] = None, teacher_id: Optional[int] = None,
                  skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_multi(db, name=name, code=code, teacher_id=teacher_id, skip=skip, limit=limit)


@router.post("/", response_model=SubjectRead, status_code=status.HTTP_201_CREATED)
def create_subject(data: SubjectCreate, db: Session = Depends(get_db)):
    if crud.get_by_code(db, data.code):
        raise HTTPException(status_code=400, detail="Código já cadastrado")
    return crud.create(db, data)


@router.get("/{subject_id}", response_model=SubjectRead)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, subject_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    return obj


@router.put("/{subject_id}", response_model=SubjectRead)
def update_subject(subject_id: int, data: SubjectUpdate, db: Session = Depends(get_db)):
    obj = crud.get(db, subject_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    return crud.update(db, obj, data)


@router.patch("/{subject_id}", response_model=SubjectRead)
def patch_subject(subject_id: int, data: SubjectPatch, db: Session = Depends(get_db)):
    obj = crud.get(db, subject_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    return crud.patch(db, obj, data)


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, subject_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    crud.delete(db, obj)


@router.get("/{subject_id}/enrollments", response_model=List[EnrollmentRead])
def subject_enrollments(subject_id: int, period_id: Optional[int] = None, db: Session = Depends(get_db)):
    from sqlalchemy.orm import joinedload
    q = db.query(Enrollment).options(
        joinedload(Enrollment.student), joinedload(Enrollment.period)
    ).filter(Enrollment.subject_id == subject_id)
    if period_id:
        q = q.filter(Enrollment.period_id == period_id)
    return q.all()


@router.get("/{subject_id}/grades", response_model=List[GradeRead])
def subject_grades(subject_id: int, period_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Grade).join(Enrollment).filter(Enrollment.subject_id == subject_id)
    if period_id:
        q = q.filter(Enrollment.period_id == period_id)
    return q.all()
