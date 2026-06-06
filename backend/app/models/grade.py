from sqlalchemy import Column, Integer, ForeignKey, String, Numeric, Text, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Grade(Base):
    __tablename__ = "grades"
    __table_args__ = (
        UniqueConstraint("enrollment_id", "grade_type", name="uq_grade"),
    )

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    grade_type = Column(String(50), nullable=False)
    value = Column(Numeric(4, 2), nullable=False)
    graded_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)

    enrollment = relationship("Enrollment", back_populates="grades")
