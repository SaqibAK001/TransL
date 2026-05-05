from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from app.api.auth import get_current_user
from app.db.mongodb import cargos_collection

router = APIRouter()


def cargo_serializer(cargo):
    return {
        "id": str(cargo["_id"]),
        "owner_id": cargo["owner_id"],
        "origin": cargo["origin"],
        "destination": cargo["destination"],
        "weight_kg": cargo["weight_kg"],
        "volume_m3": cargo["volume_m3"],
        "deadline": cargo["deadline"],
        "sender_phone": cargo.get("sender_phone"),
        "receiver_phone": cargo.get("receiver_phone"),
        "status": cargo.get("status", "Pending"),
        "created_at": cargo.get("created_at"),
    }


@router.get("/")
def get_all_cargos():
    cargos = cargos_collection.find()
    return [cargo_serializer(c) for c in cargos]


@router.post("/")
def add_cargo(cargo: dict, user=Depends(get_current_user)):

    required_fields = [
        "origin",
        "destination",
        "weight_kg",
        "volume_m3",
        "sender_phone",
        "receiver_phone"
    ]

    for field in required_fields:
        if field not in cargo or str(cargo[field]).strip() == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    # Validate phone numbers (digits only)
    if not str(cargo["sender_phone"]).isdigit():
        raise HTTPException(status_code=400, detail="Sender phone must contain only numbers")

    if not str(cargo["receiver_phone"]).isdigit():
        raise HTTPException(status_code=400, detail="Receiver phone must contain only numbers")

    new_cargo = {
        "owner_id": str(user["_id"]),
        "origin": cargo["origin"],
        "destination": cargo["destination"],
        "weight_kg": float(cargo["weight_kg"]),
        "volume_m3": float(cargo["volume_m3"]),
        "deadline": cargo.get("deadline", datetime.utcnow().isoformat()),
        "sender_phone": cargo["sender_phone"],
        "receiver_phone": cargo["receiver_phone"],
        "status": "Pending",
        "created_at": datetime.utcnow().isoformat(),
    }

    result = cargos_collection.insert_one(new_cargo)

    saved = cargos_collection.find_one({"_id": result.inserted_id})
    return cargo_serializer(saved)


@router.get("/my-cargos")
def get_my_cargos(user=Depends(get_current_user)):
    cargos = cargos_collection.find({"owner_id": str(user["_id"])})
    return [cargo_serializer(c) for c in cargos]


@router.delete("/{cargo_id}")
def delete_cargo(cargo_id: str, user=Depends(get_current_user)):

    cargo = cargos_collection.find_one({"_id": ObjectId(cargo_id)})

    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo not found")

    if cargo["owner_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Not allowed")

    cargos_collection.delete_one({"_id": ObjectId(cargo_id)})
    return {"message": "Cargo deleted successfully"}