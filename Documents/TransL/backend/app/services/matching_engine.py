from typing import List, Dict
from app.models.cargo import Cargo
from app.models.truck import Truck


def calculate_compatibility_score(cargo: Cargo, truck: Truck) -> float:
    score = 0.0

    # Route matching
    if cargo.origin == truck.location and cargo.destination == truck.route_destination:
        score += 0.4
    elif cargo.origin == truck.location:
        score += 0.2

    # Capacity constraints
    if cargo.weight > truck.capacity_weight or cargo.volume > truck.capacity_volume:
        return 0.0
    else:
        score += 0.4

    # Time window compatibility (placeholder)
    score += 0.2

    return round(score, 2)


def optimize_multi_cargo_assignment(cargos: List[Cargo], trucks: List[Truck]) -> List[Dict]:
    results = []
    remaining_cargos = cargos.copy()

    for truck in trucks:
        truck_weight_left = truck.capacity_weight
        truck_volume_left = truck.capacity_volume

        assigned_cargos = []
        total_score = 0.0

        scored = []
        for cargo in remaining_cargos:
            score = calculate_compatibility_score(cargo, truck)
            if score > 0:
                scored.append((cargo, score))

        scored.sort(key=lambda x: x[1], reverse=True)

        for cargo, score in scored:
            if cargo.weight <= truck_weight_left and cargo.volume <= truck_volume_left:
                assigned_cargos.append({
                    "cargo_id": cargo.id,
                    "origin": cargo.origin,
                    "destination": cargo.destination,
                    "weight": cargo.weight,
                    "volume": cargo.volume,
                    "score": score
                })

                truck_weight_left -= cargo.weight
                truck_volume_left -= cargo.volume
                total_score += score

        assigned_ids = [c["cargo_id"] for c in assigned_cargos]
        remaining_cargos = [c for c in remaining_cargos if c.id not in assigned_ids]

        if assigned_cargos:
            results.append({
                "truck_id": truck.id,
                "vehicle_number": truck.vehicle_number,
                "vin_number": truck.vin_number,
                "permit_number": truck.permit_number,
                "truck_route": f"{truck.location} -> {truck.route_destination}",
                "capacity_weight": truck.capacity_weight,
                "capacity_volume": truck.capacity_volume,
                "remaining_weight": round(truck_weight_left, 2),
                "remaining_volume": round(truck_volume_left, 2),
                "assigned_cargos": assigned_cargos,
                "total_score": round(total_score, 2),
                "optimization_status": "Optimized"
            })

    return results