from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Truck(Base):
    __tablename__ = "trucks"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_number = Column(String, unique=True, nullable=False)
    vin_number = Column(String, unique=True, nullable=False)
    permit_number = Column(String, nullable=False)

    location = Column(String, nullable=False)
    route_destination = Column(String, nullable=False)

    capacity_weight = Column(Float, nullable=False)
    capacity_volume = Column(Float, nullable=False)