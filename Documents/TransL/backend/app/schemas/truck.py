from pydantic import BaseModel


class TruckCreate(BaseModel):
    vehicle_number: str
    vin_number: str
    permit_number: str
    location: str
    route_destination: str
    capacity_weight: float
    capacity_volume: float


class TruckResponse(BaseModel):
    id: int
    vehicle_number: str
    vin_number: str
    permit_number: str
    location: str
    route_destination: str
    capacity_weight: float
    capacity_volume: float

    class Config:
        from_attributes = True