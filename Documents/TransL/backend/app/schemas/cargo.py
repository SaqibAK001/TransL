from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CargoCreate(BaseModel):
    owner_id: int
    origin: str
    destination: str
    weight_kg: float
    volume_m3: float
    deadline: Optional[datetime] = None


class CargoUpdate(BaseModel):
    origin: Optional[str] = None
    destination: Optional[str] = None
    weight_kg: Optional[float] = None
    volume_m3: Optional[float] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None


class CargoOut(BaseModel):
    id: int
    owner_id: int
    origin: str
    destination: str
    weight_kg: float
    volume_m3: float
    deadline: datetime
    status: str

    class Config:
        from_attributes = True