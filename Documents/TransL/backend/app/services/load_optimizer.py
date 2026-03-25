class LoadOptimizer:
    """
    Handles 3D Load Optimization.
    In production, integrate google-or-tools (CP-SAT solver).
    """
    def optimize_load(self, cargo_items: list, truck_dimensions: dict) -> dict:
        """
        Returns if items fit and suggested arrangement.
        """
        total_vol = sum([item['volume'] for item in cargo_items])
        truck_vol = truck_dimensions['l'] * truck_dimensions['w'] * truck_dimensions['h']
        
        fits = total_vol <= truck_vol * 0.90 # 90% utilization threshold
        
        return {
            "fits": fits,
            "utilization_percent": (total_vol / truck_vol) * 100 if truck_vol > 0 else 0,
            "arrangement_plan": "Layer 1: Heavy items bottom, Layer 2: Fragile top"
        }