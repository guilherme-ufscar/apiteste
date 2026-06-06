from sqlalchemy import Column, Integer, String, Boolean, Date, SmallInteger
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime
from app.database import Base


class Period(Base):
    __tablename__ = "periods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    semester = Column(SmallInteger, nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    enrollments = relationship("Enrollment", back_populates="period")
