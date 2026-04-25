import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Force load backend/.env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is missing in .env file")

client = MongoClient(MONGO_URI)

# IMPORTANT: explicitly mention database name
db = client["transl_db"]