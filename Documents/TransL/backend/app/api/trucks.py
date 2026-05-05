from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from app.api.auth import get_current_user
from app.db.mongodb import trucks_collection

router = APIRouter()


def truck_serializer(truck):
    return {
        "id": str(truck["_id"]),
        "owner_id": truck["owner_id"],
        "vehicle_number": truck["vehicle_number"],
        "vin_number": truck["vin_number"],
        "permit_number": truck["permit_number"],
        "rc_number": truck.get("rc_number"),
        "driver_phone": truck.get("driver_phone"),
        "location": truck["location"],
        "route_destination": truck["route_destination"],
        "capacity_weight": truck["capacity_weight"],
        "capacity_volume": truck["capacity_volume"],
        "created_at": truck.get("created_at"),
    }


@router.get("/trucks")
def get_all_trucks():
    trucks = trucks_collection.find()
    return [truck_serializer(t) for t in trucks]


@router.post("/add")
def add_truck(truck: dict, user=Depends(get_current_user)):

    # Check required fields
    required_fields = [
        "vehicle_number",
        "vin_number",
        "permit_number",
        "location",
        "route_destination",
        "capacity_weight",
        "capacity_volume",
        "rc_number",
        "driver_phone"
    ]

    for field in required_fields:
        if field not in truck or str(truck[field]).strip() == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    # Validate phone number (digits only)
    if not str(truck["driver_phone"]).isdigit():
        raise HTTPException(status_code=400, detail="Driver phone must contain only numbers")

    # Check unique vehicle number
    existing_vehicle = trucks_collection.find_one({"vehicle_number": truck["vehicle_number"]})
    if existing_vehicle:
        raise HTTPException(status_code=400, detail="Vehicle number already exists")

    # Check unique VIN number
    existing_vin = trucks_collection.find_one({"vin_number": truck["vin_number"]})
    if existing_vin:
        raise HTTPException(status_code=400, detail="VIN number already exists")

    new_truck = {
        "owner_id": str(user["_id"]),
        "vehicle_number": truck["vehicle_number"],
        "vin_number": truck["vin_number"],
        "permit_number": truck["permit_number"],
        "rc_number": truck["rc_number"],
        "driver_phone": truck["driver_phone"],
        "location": truck["location"],
        "route_destination": truck["route_destination"],
        "capacity_weight": float(truck["capacity_weight"]),
        "capacity_volume": float(truck["capacity_volume"]),
        "created_at": datetime.utcnow().isoformat(),
    }

    result = trucks_collection.insert_one(new_truck)
    saved = trucks_collection.find_one({"_id": result.inserted_id})

    return truck_serializer(saved)


@router.get("/my-trucks")
def get_my_trucks(user=Depends(get_current_user)):
    trucks = trucks_collection.find({"owner_id": str(user["_id"])})
    return [truck_serializer(t) for t in trucks]


@router.delete("/delete/{truck_id}")
def delete_truck(truck_id: str, user=Depends(get_current_user)):

    truck = trucks_collection.find_one({"_id": ObjectId(truck_id)})

    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")

    if truck["owner_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Not allowed")

    trucks_collection.delete_one({"_id": ObjectId(truck_id)})
    return {"message": "Truck deleted successfully"}