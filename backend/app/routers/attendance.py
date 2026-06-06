from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.attendance import AttendanceRead, AttendanceUpdate
from app.crud import attendance as crud

router = APIRouter()


@router.get("/{attendance_id}", response_model=AttendanceRead)
def get_attendance(attendance_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, attendance_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return obj


@router.put("/{attendance_id}", response_model=AttendanceRead)
def update_attendance(attendance_id: int, data: AttendanceUpdate, db: Session = Depends(get_db)):
    obj = crud.get(db, attendance_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return crud.update(db, obj, data)


@router.delete("/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(attendance_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, attendance_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    crud.delete(db, obj)
