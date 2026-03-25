from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.matching_engine import MatchingEngine
from app.models.cargo import Cargo
from app.models.truck import Truck

router = APIRouter()

@router.get("/optimize")
def optimize_loads(db: Session = Depends(get_db)):
    # Dummy data for demonstration if DB is empty
    cargos = db.query(Cargo).all()
    trucks = db.query(Truck).all()
    
    # If empty, create dummy data for testing
    if not cargos or not trucks:
        return {"matches": [], "message": "No cargo or trucks found. Please add data."}

    engine = MatchingEngine()
    matches = engine.find_best_matches(cargos, trucks)
    return {"matches": matches}