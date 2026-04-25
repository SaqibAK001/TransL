from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.truck import Truck
from app.schemas.truck import TruckCreate, TruckResponse

router = APIRouter()


@router.get("/", response_model=list[TruckResponse])
def get_all_trucks(db: Session = Depends(get_db)):
    return db.query(Truck).all()


@router.post("/add", response_model=TruckResponse)
def add_truck(truck: TruckCreate, db: Session = Depends(get_db)):

    existing_vehicle = db.query(Truck).filter(Truck.vehicle_number == truck.vehicle_number).first()
    if existing_vehicle:
        raise HTTPException(status_code=400, detail="Vehicle number already exists")

    existing_vin = db.query(Truck).filter(Truck.vin_number == truck.vin_number).first()
    if existing_vin:
        raise HTTPException(status_code=400, detail="VIN number already exists")

    new_truck = Truck(
        vehicle_number=truck.vehicle_number,
        vin_number=truck.vin_number,
        permit_number=truck.permit_number,
        location=truck.location,
        route_destination=truck.route_destination,
        capacity_weight=truck.capacity_weight,
        capacity_volume=truck.capacity_volume
    )

    db.add(new_truck)
    db.commit()
    db.refresh(new_truck)

    return new_truck


@router.delete("/delete/{truck_id}")
def delete_truck(truck_id: int, db: Session = Depends(get_db)):
    truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")

    db.delete(truck)
    db.commit()

    return {"message": "Truck deleted successfully"}