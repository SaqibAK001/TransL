from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt
from bson import ObjectId

from app.db.mongodb import matches_collection, cargos_collection, trucks_collection

router = APIRouter()

SECRET_KEY = "YOUR_SECRET_KEY_CHANGE_THIS"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/my-matches")
def get_my_matches(token: str = Depends(oauth2_scheme)):

    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Find all cargos owned by this user
    user_cargos = list(cargos_collection.find({"owner_id": user_id}))

    cargo_ids = [str(c["_id"]) for c in user_cargos]

    if len(cargo_ids) == 0:
        return []

    # Find all matches related to those cargos
    matches = list(matches_collection.find({"cargo_id": {"$in": cargo_ids}}))

    results = []

    for m in matches:
        cargo = cargos_collection.find_one({"_id": ObjectId(m["cargo_id"])})
        truck = None

        if m.get("truck_id"):
            truck = trucks_collection.find_one({"_id": ObjectId(m["truck_id"])})

        results.append({
            "match_id": str(m["_id"]),
            "cargo_id": m.get("cargo_id"),
            "truck_id": m.get("truck_id"),
            "score": m.get("score", None),
            "cargo_route": m.get("cargo_route", None),
            "assigned_truck": m.get("assigned_truck", None),
            "truck_route": m.get("truck_route", None),
            "created_at": m.get("created_at", None),

            # Optional extra details
            "cargo": {
                "origin": cargo.get("origin") if cargo else None,
                "destination": cargo.get("destination") if cargo else None,
                "weight_kg": cargo.get("weight_kg") if cargo else None,
                "volume_m3": cargo.get("volume_m3") if cargo else None,
            } if cargo else None,

            "truck": {
                "vehicle_number": truck.get("vehicle_number") if truck else None,
                "location": truck.get("location") if truck else None,
                "route_destination": truck.get("route_destination") if truck else None,
            } if truck else None
        })

    return results