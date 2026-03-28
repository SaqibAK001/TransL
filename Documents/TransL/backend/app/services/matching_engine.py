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
        
        # 1. Route Compatibility (simplified string matching)
        # Check if truck's route matches cargo route
        if (cargo.origin.lower() == truck.current_location.lower() and 
            cargo.destination.lower() == truck.route_destination.lower()):
            score += 0.4  # Perfect route match
        elif cargo.origin.lower() == truck.current_location.lower():
            score += 0.2  # Partial match (same origin)
        
        # 2. Capacity Check (Weight & Volume) - HARD CONSTRAINT
        if truck.capacity_kg >= cargo.weight_kg and truck.volume_m3 >= cargo.volume_m3:
            score += 0.4
        else:
            return 0.0  # Cannot match if truck is too small
        
        # 3. Time Window (simplified - always add points for now)
        # In production, you'd compare cargo.deadline with truck's schedule
        score += 0.2
        
        return min(score, 1.0)  # Cap at 1.0

    def find_best_matches(self, cargos: List[Cargo], trucks: List[Truck]) -> List[Dict]:
        """
        Find best cargo-truck matches using compatibility scoring.
        """
        matches = []
        
        for cargo in cargos:
            best_truck = None
            best_score = 0
            
            for truck in trucks:
                # Only consider available trucks
                if truck.available:
                    score = self.calculate_compatibility_score(cargo, truck)
                    
                    if score > best_score:
                        best_score = score
                        best_truck = truck
            
            # Only add matches with score > 0
            if best_truck and best_score > 0:
                matches.append({
                    "cargo_id": cargo.id,
                    "truck_id": best_truck.id,
                    "score": round(best_score, 2),
                    "optimization_status": "Optimized",
                    "route": f"{cargo.origin} → {cargo.destination}",
                    "capacity_used": f"{(cargo.weight_kg/truck.capacity_kg)*100:.1f}% weight"
                })
        
        return matches