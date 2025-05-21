from fastapi import APIRouter, HTTPException
from typing import List

from app.database import (
    add_user, get_user, get_all_users, get_user_by_username
)
from app.models import User, UserCreate

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "User not found"}},
)

@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    existing_user = get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    return add_user(user.dict())

@router.get("/", response_model=List[User])
async def read_users(skip: int = 0, limit: int = 100):
    users = get_all_users()
    return users[skip : skip + limit]

@router.get("/{user_id}", response_model=User)
async def read_user(user_id: int):
    user = get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/by-username/{username}", response_model=User)
async def read_user_by_username(username: str):
    user = get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
