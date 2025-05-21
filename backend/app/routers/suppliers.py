from fastapi import APIRouter, HTTPException
from typing import List

from app.database import (
    add_supplier, get_supplier, get_all_suppliers, update_supplier, delete_supplier
)
from app.models import Supplier, SupplierCreate

router = APIRouter(
    prefix="/suppliers",
    tags=["suppliers"],
    responses={404: {"description": "Supplier not found"}},
)

@router.post("/", response_model=Supplier)
async def create_supplier(supplier: SupplierCreate):
    return add_supplier(supplier.dict())

@router.get("/", response_model=List[Supplier])
async def read_suppliers(skip: int = 0, limit: int = 100):
    suppliers = get_all_suppliers()
    return suppliers[skip : skip + limit]

@router.get("/{supplier_id}", response_model=Supplier)
async def read_supplier(supplier_id: int):
    supplier = get_supplier(supplier_id)
    if supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.put("/{supplier_id}", response_model=Supplier)
async def update_supplier_endpoint(supplier_id: int, supplier: SupplierCreate):
    updated_supplier = update_supplier(supplier_id, supplier.dict())
    if updated_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return updated_supplier

@router.delete("/{supplier_id}")
async def delete_supplier_endpoint(supplier_id: int):
    success = delete_supplier(supplier_id)
    if not success:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"message": "Supplier deleted successfully"}
