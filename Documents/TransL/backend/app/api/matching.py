from fastapi import APIRouter
from app.db.mongodb import cargos_collection, trucks_collection, matches_collection
from datetime import datetime

router = APIRouter()


# ---------- SCORING HELPERS ----------
def normalize_text(txt: str):
    if not txt:
        return ""
    return txt.strip().lower()


def location_score(cargo_origin, truck_location):
    """
    100 if exact location match, else partial match score.
    """
    cargo_origin = normalize_text(cargo_origin)
    truck_location = normalize_text(truck_location)

    if cargo_origin == truck_location:
        return 100

    # partial keyword match
    if cargo_origin in truck_location or truck_location in cargo_origin:
        return 70

    return 30


def destination_score(cargo_destination, truck_destination):
    """
    100 if exact destination match, else partial match score.
    """
    cargo_destination = normalize_text(cargo_destination)
    truck_destination = normalize_text(truck_destination)

    if cargo_destination == truck_destination:
        return 100

    if cargo_destination in truck_destination or truck_destination in cargo_destination:
        return 70

    return 30


def capacity_score(cargo_weight, cargo_volume, truck_weight, truck_volume):
    """
    Gives better score if truck capacity is close to cargo (less wasted space).
    """
    if truck_weight <= 0 or truck_volume <= 0:
        return 0

    weight_util = cargo_weight / truck_weight
    volume_util = cargo_volume / truck_volume

    # utilization should be <= 1.0
    if weight_util > 1 or volume_util > 1:
        return 0

    # best if utilization is close to 1
    util = (weight_util + volume_util) / 2

    # util 1.0 => score 100
    # util 0.5 => score 50
    return round(util * 100, 2)


def compute_match_score(cargo, truck):
    """
    Final score out of 100
    """
    cargo_origin = cargo.get("origin")
    cargo_destination = cargo.get("destination")

    truck_location = truck.get("location")
    truck_destination = truck.get("route_destination")

    cargo_weight = float(cargo.get("weight_kg", 0))
    cargo_volume = float(cargo.get("volume_m3", 0))

    truck_weight = float(truck.get("capacity_weight", 0))
    truck_volume = float(truck.get("capacity_volume", 0))

    # must fit basic constraints
    if truck_weight < cargo_weight or truck_volume < cargo_volume:
        return 0

    s1 = location_score(cargo_origin, truck_location)        # 0-100
    s2 = destination_score(cargo_destination, truck_destination)  # 0-100
    s3 = capacity_score(cargo_weight, cargo_volume, truck_weight, truck_volume)  # 0-100

    # weighted score
    final_score = (0.35 * s1) + (0.35 * s2) + (0.30 * s3)

    return round(final_score, 2)


# ---------- ROUTE ----------
@router.post("/run")
def run_matching():

    cargos = list(cargos_collection.find())
    trucks = list(trucks_collection.find())

    results = []

    for cargo in cargos:

        best_truck = None
        best_score = 0

        for truck in trucks:
            score = compute_match_score(cargo, truck)

            if score > best_score:
                best_score = score
                best_truck = truck

        match_obj = {
            "cargo_id": str(cargo["_id"]),
            "truck_id": str(best_truck["_id"]) if best_truck else None,
            "score": best_score if best_truck else 0,
            "created_at": datetime.utcnow().isoformat(),
        }

        matches_collection.insert_one(match_obj)

        results.append({
            "cargo_id": str(cargo["_id"]),
            "truck_id": str(best_truck["_id"]) if best_truck else None,
            "score": best_score if best_truck else 0,
            "cargo_route": f"{cargo.get('origin')} -> {cargo.get('destination')}",
            "cargo_weight": cargo.get("weight_kg"),
            "cargo_volume": cargo.get("volume_m3"),
            "assigned_truck": best_truck["vehicle_number"] if best_truck else None,
            "truck_route": f"{best_truck.get('location')} -> {best_truck.get('route_destination')}" if best_truck else None
        })

    return results