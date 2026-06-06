from sqlalchemy.orm import Session
from app.models.grade import Grade
from app.schemas.grade import GradeUpdate


def get(db: Session, grade_id: int):
    return db.query(Grade).filter(Grade.id == grade_id).first()


def update(db: Session, grade: Grade, data: GradeUpdate):
    for field, value in data.model_dump().items():
        setattr(grade, field, value)
    db.commit()
    db.refresh(grade)
    return grade


def delete(db: Session, grade: Grade):
    db.delete(grade)
    db.commit()
