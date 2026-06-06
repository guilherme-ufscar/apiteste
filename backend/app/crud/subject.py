from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectPatch


def get_multi(db: Session, name: Optional[str] = None, code: Optional[str] = None, teacher_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    q = db.query(Subject).options(joinedload(Subject.teacher))
    if name:
        q = q.filter(Subject.name.ilike(f"%{name}%"))
    if code:
        q = q.filter(Subject.code.ilike(f"%{code}%"))
    if teacher_id:
        q = q.filter(Subject.teacher_id == teacher_id)
    return q.order_by(Subject.name).offset(skip).limit(limit).all()


def get(db: Session, subject_id: int):
    return db.query(Subject).options(joinedload(Subject.teacher)).filter(Subject.id == subject_id).first()


def get_by_code(db: Session, code: str):
    return db.query(Subject).filter(Subject.code == code).first()


def create(db: Session, data: SubjectCreate):
    obj = Subject(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return get(db, obj.id)


def update(db: Session, subject: Subject, data: SubjectUpdate):
    for field, value in data.model_dump().items():
        setattr(subject, field, value)
    db.commit()
    return get(db, subject.id)


def patch(db: Session, subject: Subject, data: SubjectPatch):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(subject, field, value)
    db.commit()
    return get(db, subject.id)


def delete(db: Session, subject: Subject):
    db.delete(subject)
    db.commit()
