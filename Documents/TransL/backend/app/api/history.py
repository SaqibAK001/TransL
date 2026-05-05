from fastapi import APIRouter, Depends
from app.core.mongo import db
from app.api.auth import get_current_user

router = APIRouter()

cargo_collection = db["cargos"]
truck_collection = db["trucks"]


def serialize_cargo(cargo):
    return {
        "id": str(cargo["_id"]),
        "owner_id": cargo["owner_id"],
        "origin": cargo["origin"],
        "destination": cargo["destination"],
        "weight_kg": cargo["weight_kg"],
        "volume_m3": cargo["volume_m3"],
        "deadline": cargo["deadline"],
        "status": cargo["status"],
        "created_at": cargo["created_at"],
    }


def serialize_truck(truck):
    return {
        "id": str(truck["_id"]),
        "owner_id": truck["owner_id"],
        "vehicle_number": truck["vehicle_number"],
        "vin_number": truck["vin_number"],
        "permit_number": truck["permit_number"],
        "location": truck["location"],
        "route_destination": truck["route_destination"],
        "capacity_weight": truck["capacity_weight"],
        "capacity_volume": truck["capacity_volume"],
        "created_at": truck["created_at"],
    }


@router.get("/my-cargos")
def my_cargos(user=Depends(get_current_user)):
    cargos = list(cargo_collection.find({"owner_id": str(user["_id"])}).sort("created_at", -1))
    return [serialize_cargo(c) for c in cargos]


@router.get("/my-trucks")
def my_trucks(user=Depends(get_current_user)):
    trucks = list(truck_collection.find({"owner_id": str(user["_id"])}).sort("created_at", -1))
    return [serialize_truck(t) for t in trucks]