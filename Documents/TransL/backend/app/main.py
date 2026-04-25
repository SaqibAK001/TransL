from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import trucks, cargo, matching, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trucks.router, prefix="/api")
app.include_router(cargo.router, prefix="/api")
app.include_router(matching.router, prefix="/api")
app.include_router(auth.router, prefix="/api")