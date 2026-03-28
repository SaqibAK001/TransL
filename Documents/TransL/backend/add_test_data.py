from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models.cargo import Cargo
from app.models.truck import Truck
from app.db.base import Base
from datetime import datetime, timedelta

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

print("📦 Adding test cargo...")

# Add Test Cargo
cargo1 = Cargo(
    owner_id=1,
    origin="Mumbai",
    destination="Delhi",
    weight_kg=5000,
    volume_m3=20,
    deadline=datetime.utcnow() + timedelta(days=3)
)

cargo2 = Cargo(
    owner_id=1,
    origin="Bangalore",
    destination="Chennai",
    weight_kg=3000,
    volume_m3=15,
    deadline=datetime.utcnow() + timedelta(days=2)
)

print("🚚 Adding test trucks...")

# Add Test Trucks
truck1 = Truck(
    owner_id=1,
    current_location="Mumbai",
    route_destination="Delhi",
    capacity_kg=10000,
    volume_m3=40,
    available=True
)

truck2 = Truck(
    owner_id=1,
    current_location="Bangalore",
    route_destination="Chennai",
    capacity_kg=8000,
    volume_m3=35,
    available=True
)

# Add to database
db.add_all([cargo1, cargo2, truck1, truck2])
db.commit()

print("\n✅ Test data added successfully!")
print(f"   Cargo 1: {cargo1.origin} → {cargo1.destination} ({cargo1.weight_kg}kg)")
print(f"   Cargo 2: {cargo2.origin} → {cargo2.destination} ({cargo2.weight_kg}kg)")
print(f"   Truck 1: {truck1.current_location} → {truck1.route_destination} ({truck1.capacity_kg}kg capacity)")
print(f"   Truck 2: {truck2.current_location} → {truck2.route_destination} ({truck2.capacity_kg}kg capacity)")

db.close()