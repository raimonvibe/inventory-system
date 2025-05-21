from fastapi import APIRouter, HTTPException
from typing import List, Optional

from app.database import (
    add_item, get_item, get_all_items, update_item, delete_item
)
from app.models import Item, ItemCreate

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Item not found"}},
)

@router.post("/", response_model=Item)
async def create_item(item: ItemCreate):
    return add_item(item.dict())

@router.get("/", response_model=List[Item])
async def read_items(skip: int = 0, limit: int = 100, category: Optional[str] = None):
    items = get_all_items()
    
    if category:
        items = [item for item in items if item["category"] == category]
    
    return items[skip : skip + limit]

@router.get("/{item_id}", response_model=Item)
async def read_item(item_id: int):
    item = get_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=Item)
async def update_item_endpoint(item_id: int, item: ItemCreate):
    updated_item = update_item(item_id, item.dict())
    if updated_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item

@router.delete("/{item_id}")
async def delete_item_endpoint(item_id: int):
    success = delete_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}
