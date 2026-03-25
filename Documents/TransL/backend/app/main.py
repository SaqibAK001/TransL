from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base
from app.db.session import engine
from app.api import auth, cargo, truck, matching

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Team Rocket Logistics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(cargo.router, prefix="/api/cargo", tags=["Cargo"])
# app.include_router(truck.router, prefix="/api/truck", tags=["Trucks"])
app.include_router(matching.router, prefix="/api/matching", tags=["AI Matching"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Team Rocket - AI Logistics Optimization"}