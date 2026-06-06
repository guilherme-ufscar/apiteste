from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db
from app.schemas.teacher import TeacherCreate, TeacherUpdate, TeacherPatch, TeacherRead
from app.schemas.subject import SubjectRead
from app.crud import teacher as crud

router = APIRouter()


@router.get("/", response_model=List[TeacherRead])
def list_teachers(name: Optional[str] = None, is_active: Optional[bool] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_multi(db, name=name, is_active=is_active, skip=skip, limit=limit)


@router.post("/", response_model=TeacherRead, status_code=status.HTTP_201_CREATED)
def create_teacher(data: TeacherCreate, db: Session = Depends(get_db)):
    if crud.get_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return crud.create(db, data)


@router.get("/{teacher_id}", response_model=TeacherRead)
def get_teacher(teacher_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, teacher_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return obj


@router.put("/{teacher_id}", response_model=TeacherRead)
def update_teacher(teacher_id: int, data: TeacherUpdate, db: Session = Depends(get_db)):
    obj = crud.get(db, teacher_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return crud.update(db, obj, data)


@router.patch("/{teacher_id}", response_model=TeacherRead)
def patch_teacher(teacher_id: int, data: TeacherPatch, db: Session = Depends(get_db)):
    obj = crud.get(db, teacher_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return crud.patch(db, obj, data)


@router.delete("/{teacher_id}", response_model=TeacherRead)
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, teacher_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return crud.delete(db, obj)


@router.get("/{teacher_id}/subjects", response_model=List[SubjectRead])
def teacher_subjects(teacher_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, teacher_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return obj.subjects
