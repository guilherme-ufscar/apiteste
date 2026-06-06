from sqlalchemy import Column, Integer, String, Boolean, Date, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False, index=True)
    cpf = Column(String(14), unique=True, nullable=True)
    birth_date = Column(Date, nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    registration = Column(String(20), unique=True, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    enrollments = relationship("Enrollment", back_populates="student")
