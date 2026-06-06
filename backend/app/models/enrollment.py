from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("student_id", "subject_id", "period_id", name="uq_enrollment"),
    )

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    period_id = Column(Integer, ForeignKey("periods.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="active")
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="enrollments")
    subject = relationship("Subject", back_populates="enrollments")
    period = relationship("Period", back_populates="enrollments")
    grades = relationship("Grade", back_populates="enrollment", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="enrollment", cascade="all, delete-orphan")
