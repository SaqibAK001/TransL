from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.core.database import Base


class Cargo(Base):
    __tablename__ = "cargos"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, nullable=False)

    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)

    weight_kg = Column(Float, nullable=False)
    volume_m3 = Column(Float, nullable=False)

    deadline = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Pending")