from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ItemBase(BaseModel):
    name: str
    description: str
    price: float
    quantity: int
    category: str
    image_url: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class TransactionBase(BaseModel):
    item_id: int
    quantity: int
    transaction_type: str  # "purchase" or "sale"
    price_per_unit: float
    total_price: float


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class SupplierBase(BaseModel):
    name: str
    contact_person: str
    email: str
    phone: str
    address: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class Supplier(SupplierBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str
    email: str
    role: str = "staff"  # "admin", "manager", or "staff"


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class AnalyticsData(BaseModel):
    total_sales: float
    total_purchases: float
    profit: float
    low_stock_items: List[Item]
    top_selling_items: List[Item]
