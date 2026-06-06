from sqlalchemy.orm import Session
from typing import Optional
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate, StudentPatch


def get_multi(db: Session, name: Optional[str] = None, is_active: Optional[bool] = None, skip: int = 0, limit: int = 100):
    q = db.query(Student)
    if name:
        q = q.filter(Student.name.ilike(f"%{name}%"))
    if is_active is not None:
        q = q.filter(Student.is_active == is_active)
    return q.order_by(Student.name).offset(skip).limit(limit).all()


def get(db: Session, student_id: int):
    return db.query(Student).filter(Student.id == student_id).first()


def get_by_email(db: Session, email: str):
    return db.query(Student).filter(Student.email == email).first()


def create(db: Session, data: StudentCreate):
    obj = Student(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update(db: Session, student: Student, data: StudentUpdate):
    for field, value in data.model_dump().items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def patch(db: Session, student: Student, data: StudentPatch):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def delete(db: Session, student: Student):
    student.is_active = False
    db.commit()
    db.refresh(student)
    return student
