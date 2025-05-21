from fastapi import APIRouter, HTTPException
from typing import List

from app.database import (
    add_transaction, get_transaction, get_all_transactions
)
from app.models import Transaction, TransactionCreate

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
    responses={404: {"description": "Transaction not found"}},
)

@router.post("/", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate):
    return add_transaction(transaction.dict())

@router.get("/", response_model=List[Transaction])
async def read_transactions(skip: int = 0, limit: int = 100):
    transactions = get_all_transactions()
    return transactions[skip : skip + limit]

@router.get("/{transaction_id}", response_model=Transaction)
async def read_transaction(transaction_id: int):
    transaction = get_transaction(transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction
