from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.grade import GradeRead, GradeUpdate
from app.crud import grade as crud

router = APIRouter()


@router.get("/{grade_id}", response_model=GradeRead)
def get_grade(grade_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, grade_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    return obj


@router.put("/{grade_id}", response_model=GradeRead)
def update_grade(grade_id: int, data: GradeUpdate, db: Session = Depends(get_db)):
    obj = crud.get(db, grade_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    return crud.update(db, obj, data)


@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(grade_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, grade_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    crud.delete(db, obj)
