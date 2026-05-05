from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api import auth, cargo, trucks, matching, match_details, my_matches

app = FastAPI()

# Read frontend URL from environment (Netlify URL)
FRONTEND_URL = os.getenv("FRONTEND_URL")

origins = []

# Allow localhost for testing
origins.append("http://localhost:5173")
origins.append("http://127.0.0.1:5173")

# Allow deployed frontend (Netlify)
if FRONTEND_URL:
    origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(cargo.router, prefix="/api", tags=["Cargo"])
app.include_router(trucks.router, prefix="/api", tags=["Trucks"])
app.include_router(matching.router, prefix="/api", tags=["Matching"])
app.include_router(match_details.router, prefix="/api", tags=["Match Details"])
app.include_router(my_matches.router, prefix="/api", tags=["Matches"])


@app.get("/")
def home():
    return {"message": "TransL Backend is running"}