from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.cargo import Cargo
from app.schemas.cargo import CargoCreate, CargoOut, CargoUpdate

router = APIRouter()


@router.get("/", response_model=list[CargoOut])
def get_all_cargos(db: Session = Depends(get_db)):
    cargos = db.query(Cargo).all()
    return cargos


@router.post("/", response_model=CargoOut)
def add_cargo(cargo: CargoCreate, db: Session = Depends(get_db)):
    new_cargo = Cargo(
        owner_id=cargo.owner_id,
        origin=cargo.origin,
        destination=cargo.destination,
        weight_kg=cargo.weight_kg,
        volume_m3=cargo.volume_m3,
        deadline=cargo.deadline,
        status="Pending"
    )

    db.add(new_cargo)
    db.commit()
    db.refresh(new_cargo)
    return new_cargo


@router.put("/{cargo_id}", response_model=CargoOut)
def update_cargo(cargo_id: int, cargo: CargoUpdate, db: Session = Depends(get_db)):
    existing = db.query(Cargo).filter(Cargo.id == cargo_id).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Cargo not found")

    if cargo.origin is not None:
        existing.origin = cargo.origin
    if cargo.destination is not None:
        existing.destination = cargo.destination
    if cargo.weight_kg is not None:
        existing.weight_kg = cargo.weight_kg
    if cargo.volume_m3 is not None:
        existing.volume_m3 = cargo.volume_m3
    if cargo.deadline is not None:
        existing.deadline = cargo.deadline
    if cargo.status is not None:
        existing.status = cargo.status

    db.commit()
    db.refresh(existing)
    return existing


@router.delete("/{cargo_id}")
def delete_cargo(cargo_id: int, db: Session = Depends(get_db)):
    cargo = db.query(Cargo).filter(Cargo.id == cargo_id).first()

    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo not found")

    db.delete(cargo)
    db.commit()
    return {"message": "Cargo deleted successfully"}