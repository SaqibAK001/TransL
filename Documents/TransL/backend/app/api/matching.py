from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.truck import Truck
from app.models.cargo import Cargo

router = APIRouter()

@router.post("/run")
def run_matching(db: Session = Depends(get_db)):

    trucks = db.query(Truck).all()
    cargos = db.query(Cargo).all()

    results = []

    for cargo in cargos:
        assigned = False

        for truck in trucks:

            # truck.capacity_weight is in tons, cargo.weight_kg is in kg
            truck_weight_capacity_kg = truck.capacity_weight * 1000

            if truck_weight_capacity_kg >= cargo.weight_kg and truck.capacity_volume >= cargo.volume_m3:
                results.append({
                    "cargo_id": cargo.id,
                    "owner_id": cargo.owner_id,
                    "cargo_route": f"{cargo.origin} -> {cargo.destination}",
                    "cargo_weight": cargo.weight_kg,
                    "cargo_volume": cargo.volume_m3,
                    "assigned_truck": truck.vehicle_number,
                    "truck_route": f"{truck.location} -> {truck.route_destination}"
                })

                assigned = True
                break

        if not assigned:
            results.append({
                "cargo_id": cargo.id,
                "owner_id": cargo.owner_id,
                "cargo_route": f"{cargo.origin} -> {cargo.destination}",
                "cargo_weight": cargo.weight_kg,
                "cargo_volume": cargo.volume_m3,
                "assigned_truck": None,
                "truck_route": None
            })

    return {"matches": results}