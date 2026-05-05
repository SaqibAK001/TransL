import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI missing in .env")

client = MongoClient(MONGO_URI)
db = client["transl_db"]

users_collection = db["users"]
cargos_collection = db["cargos"]
trucks_collection = db["trucks"]
matches_collection = db["matches"]