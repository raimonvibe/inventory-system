from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import items, transactions, suppliers, users, analytics

app = FastAPI(
    title="Inventory Management System API",
    description="API for managing inventory, transactions, suppliers, and users",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(items.router)
app.include_router(transactions.router)
app.include_router(suppliers.router)
app.include_router(users.router)
app.include_router(analytics.router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Inventory Management System API",
        "docs": "/docs",
        "redoc": "/redoc"
    }
