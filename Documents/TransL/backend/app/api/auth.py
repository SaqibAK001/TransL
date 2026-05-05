from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from passlib.context import CryptContext
from bson import ObjectId
import jwt

from app.db.mongodb import users_collection

router = APIRouter(tags=["Auth"])

SECRET_KEY = "YOUR_SECRET_KEY_CHANGE_THIS"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ------------------ SCHEMAS ------------------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UpdateProfile(BaseModel):
    name: str


class ChangePassword(BaseModel):
    old_password: str
    new_password: str


# ------------------ HELPERS ------------------

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ------------------ AUTH DEPENDENCY ------------------
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    db_user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user


# ------------------ ROUTES ------------------

@router.post("/signup")
def signup(user: UserCreate):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "created_at": datetime.utcnow(),
    }

    users_collection.insert_one(new_user)
    return {"message": "User created successfully"}


@router.post("/login-json", response_model=TokenResponse)
def login_json(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(db_user["_id"]), "email": db_user["email"]})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db_user = users_collection.find_one({"email": form_data.username})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(form_data.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(db_user["_id"]), "email": db_user["email"]})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
    }


@router.put("/update")
def update_profile(data: UpdateProfile, user=Depends(get_current_user)):
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"name": data.name}}
    )

    updated = users_collection.find_one({"_id": user["_id"]})

    return {
        "id": str(updated["_id"]),
        "name": updated.get("name"),
        "email": updated.get("email"),
    }


@router.put("/change-password")
def change_password(data: ChangePassword, user=Depends(get_current_user)):
    if not verify_password(data.old_password, user["password"]):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hash_password(data.new_password)}}
    )

    return {"message": "Password updated successfully"}

@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
    }