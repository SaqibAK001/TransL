from typing import List, Dict
from app.models.cargo import Cargo
from app.models.truck import Truck

class MatchingEngine:
    def __init__(self):
        pass

    def calculate_compatibility_score(self, cargo: Cargo, truck: Truck) -> float:
        """
        AI Heuristic: Scores a match based on Route, Capacity, and Time.
        Score 0.0 to 1.0 (1.0 is perfect match)
        """
        score = 0.0
        
        # 1. Route Compatibility (Simplified Haversine or Map API logic)
        # In production, use Google Distance Matrix or OSRM
        route_match = self._check_route_overlap(cargo.origin, cargo.destination, truck.current_location, truck.route_destination)
        if route_match:
            score += 0.4
        
        # 2. Capacity Check (Weight & Volume)
        if truck.capacity_kg >= cargo.weight_kg and truck.volume_m3 >= cargo.volume_m3:
            score += 0.4
        else:
            return 0.0 # Hard constraint failed
        
        # 3. Time Window
        if truck.availability_date <= cargo.deadline:
            score += 0.2
            
        return score

    def _check_route_overlap(self, c_orig, c_dest, t_orig, t_dest) -> bool:
        # Simplified logic: Check if truck is moving in general direction
        # Real implementation uses Geospatial libraries
        return True 

    def find_best_matches(self, cargos: List[Cargo], trucks: List[Truck]) -> List[Dict]:
        matches = []
        for cargo in cargos:
            best_truck = None
            best_score = 0
            for truck in trucks:
                if truck.available:
                    score = self.calculate_compatibility_score(cargo, truck)
                    if score > best_score:
                        best_score = score
                        best_truck = truck
            
            if best_truck:
                matches.append({
                    "cargo_id": cargo.id,
                    "truck_id": best_truck.id,
                    "score": best_score,
                    "optimization_status": "Pending 3D Check"
                })
        return matches