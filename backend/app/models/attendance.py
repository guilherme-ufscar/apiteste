from sqlalchemy import Column, Integer, ForeignKey, Boolean, Date, Text, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (
        UniqueConstraint("enrollment_id", "class_date", name="uq_attendance"),
    )

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    class_date = Column(Date, nullable=False)
    present = Column(Boolean, nullable=False, default=False)
    notes = Column(Text, nullable=True)

    enrollment = relationship("Enrollment", back_populates="attendance_records")
