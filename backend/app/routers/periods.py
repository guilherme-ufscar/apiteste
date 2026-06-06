from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db
from app.schemas.period import PeriodCreate, PeriodUpdate, PeriodPatch, PeriodRead, PeriodStats
from app.crud import period as crud

router = APIRouter()


@router.get("/", response_model=List[PeriodRead])
def list_periods(is_active: Optional[bool] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_multi(db, is_active=is_active, skip=skip, limit=limit)


@router.post("/", response_model=PeriodRead, status_code=status.HTTP_201_CREATED)
def create_period(data: PeriodCreate, db: Session = Depends(get_db)):
    return crud.create(db, data)


@router.get("/{period_id}", response_model=PeriodRead)
def get_period(period_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, period_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Período não encontrado")
    return obj


@router.put("/{period_id}", response_model=PeriodRead)
def update_period(period_id: int, data: PeriodUpdate, db: Session = Depends(get_db)):
    obj = crud.get(db, period_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Período não encontrado")
    return crud.update(db, obj, data)


@router.patch("/{period_id}", response_model=PeriodRead)
def patch_period(period_id: int, data: PeriodPatch, db: Session = Depends(get_db)):
    obj = crud.get(db, period_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Período não encontrado")
    return crud.patch(db, obj, data)


@router.delete("/{period_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_period(period_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, period_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Período não encontrado")
    crud.delete(db, obj)


@router.get("/{period_id}/stats", response_model=PeriodStats)
def period_stats(period_id: int, db: Session = Depends(get_db)):
    obj = crud.get(db, period_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Período não encontrado")
    stats = crud.get_stats(db, period_id)
    return PeriodStats(period_id=obj.id, period_name=obj.name, **stats)
