from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from app.db.base import Base
from datetime import datetime

class Cargo(Base):
    __tablename__ = "cargos"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, index=True)
    origin = Column(String)
    destination = Column(String)
    weight_kg = Column(Float)
    volume_m3 = Column(Float)
    deadline = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")