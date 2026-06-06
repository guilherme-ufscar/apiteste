from sqlalchemy.orm import Session
from typing import Optional
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherUpdate, TeacherPatch


def get_multi(db: Session, name: Optional[str] = None, is_active: Optional[bool] = None, skip: int = 0, limit: int = 100):
    q = db.query(Teacher)
    if name:
        q = q.filter(Teacher.name.ilike(f"%{name}%"))
    if is_active is not None:
        q = q.filter(Teacher.is_active == is_active)
    return q.order_by(Teacher.name).offset(skip).limit(limit).all()


def get(db: Session, teacher_id: int):
    return db.query(Teacher).filter(Teacher.id == teacher_id).first()


def get_by_email(db: Session, email: str):
    return db.query(Teacher).filter(Teacher.email == email).first()


def create(db: Session, data: TeacherCreate):
    obj = Teacher(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update(db: Session, teacher: Teacher, data: TeacherUpdate):
    for field, value in data.model_dump().items():
        setattr(teacher, field, value)
    db.commit()
    db.refresh(teacher)
    return teacher


def patch(db: Session, teacher: Teacher, data: TeacherPatch):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(teacher, field, value)
    db.commit()
    db.refresh(teacher)
    return teacher


def delete(db: Session, teacher: Teacher):
    teacher.is_active = False
    db.commit()
    db.refresh(teacher)
    return teacher
