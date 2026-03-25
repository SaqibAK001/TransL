from sqlalchemy import Column, Integer, String, Float, Boolean
from app.db.base import Base

class Truck(Base):
    __tablename__ = "trucks"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, index=True)
    current_location = Column(String)
    route_destination = Column(String)
    capacity_kg = Column(Float)
    volume_m3 = Column(Float)
    available = Column(Boolean, default=True)