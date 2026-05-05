from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.db.mongodb import cargos_collection, trucks_collection, matches_collection

router = APIRouter()


def cargo_serializer(cargo):
    return {
        "id": str(cargo["_id"]),
        "owner_id": cargo.get("owner_id"),
        "origin": cargo.get("origin"),
        "destination": cargo.get("destination"),
        "weight_kg": cargo.get("weight_kg"),
        "volume_m3": cargo.get("volume_m3"),
        "deadline": cargo.get("deadline"),
        "status": cargo.get("status", "Pending"),
    }


def truck_serializer(truck):
    return {
        "id": str(truck["_id"]),
        "owner_id": truck.get("owner_id"),
        "vehicle_number": truck.get("vehicle_number"),
        "vin_number": truck.get("vin_number"),
        "permit_number": truck.get("permit_number"),
        "location": truck.get("location"),
        "route_destination": truck.get("route_destination"),
        "capacity_weight": truck.get("capacity_weight"),
        "capacity_volume": truck.get("capacity_volume"),
    }


@router.get("/match/{cargo_id}")
def get_match_details(cargo_id: str):

    try:
        cargo = cargos_collection.find_one({"_id": ObjectId(cargo_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid cargo id format")

    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo not found")

    # Get latest match for this cargo
    match = matches_collection.find_one(
        {"cargo_id": cargo_id},
        sort=[("created_at", -1)]
    )

    if not match or not match.get("truck_id"):
        return {
            "cargo": cargo_serializer(cargo),
            "truck": None,
            "score": 0
        }

    try:
        truck = trucks_collection.find_one({"_id": ObjectId(match["truck_id"])})
    except:
        truck = None

    if not truck:
        return {
            "cargo": cargo_serializer(cargo),
            "truck": None,
            "score": match.get("score", 0)
        }

    return {
        "cargo": cargo_serializer(cargo),
        "truck": truck_serializer(truck),
        "score": match.get("score", 0)
    }