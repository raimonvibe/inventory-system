from datetime import datetime
from typing import Dict, List, Optional
import random

items_db: Dict[int, dict] = {}
transactions_db: Dict[int, dict] = {}
suppliers_db: Dict[int, dict] = {}
users_db: Dict[int, dict] = {}

item_id_counter = 1
transaction_id_counter = 1
supplier_id_counter = 1
user_id_counter = 1

def init_sample_data():
    global item_id_counter, transaction_id_counter, supplier_id_counter, user_id_counter
    
    categories = ["Electronics", "Clothing", "Food", "Office Supplies", "Home Goods"]
    
    sample_items = [
        {"name": "Smartphone", "description": "Latest model smartphone with high-end features", "price": 899.99, "quantity": 25, "category": "Electronics", "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2042&auto=format&fit=crop"},
        {"name": "Laptop", "description": "Powerful laptop for professional use", "price": 1299.99, "quantity": 15, "category": "Electronics", "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop"},
        {"name": "T-shirt", "description": "Cotton t-shirt, various colors", "price": 19.99, "quantity": 100, "category": "Clothing", "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop"},
        {"name": "Coffee Beans", "description": "Premium coffee beans, 1kg bag", "price": 24.99, "quantity": 50, "category": "Food", "image_url": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1961&auto=format&fit=crop"},
        {"name": "Office Chair", "description": "Ergonomic office chair with lumbar support", "price": 249.99, "quantity": 10, "category": "Office Supplies", "image_url": "https://images.unsplash.com/photo-1505843490701-5be5d0b19d58?q=80&w=1887&auto=format&fit=crop"},
        {"name": "Desk Lamp", "description": "LED desk lamp with adjustable brightness", "price": 39.99, "quantity": 30, "category": "Home Goods", "image_url": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop"},
        {"name": "Headphones", "description": "Noise-cancelling wireless headphones", "price": 199.99, "quantity": 20, "category": "Electronics", "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"},
        {"name": "Jeans", "description": "Classic fit jeans, various sizes", "price": 49.99, "quantity": 75, "category": "Clothing", "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926&auto=format&fit=crop"},
        {"name": "Tea Set", "description": "Porcelain tea set with 4 cups", "price": 59.99, "quantity": 15, "category": "Home Goods", "image_url": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop"},
        {"name": "Notebook", "description": "Premium hardcover notebook, 200 pages", "price": 14.99, "quantity": 100, "category": "Office Supplies", "image_url": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1887&auto=format&fit=crop"},
    ]
    
    for item_data in sample_items:
        add_item(item_data)
    
    sample_suppliers = [
        {"name": "Tech Distributors Inc.", "contact_person": "John Smith", "email": "john@techdist.com", "phone": "555-1234", "address": "123 Tech Blvd, Silicon Valley, CA"},
        {"name": "Fashion Wholesale Co.", "contact_person": "Emma Johnson", "email": "emma@fashionwholesale.com", "phone": "555-5678", "address": "456 Fashion Ave, New York, NY"},
        {"name": "Global Foods Supply", "contact_person": "Michael Chen", "email": "michael@globalfoods.com", "phone": "555-9012", "address": "789 Food St, Chicago, IL"},
    ]
    
    for supplier_data in sample_suppliers:
        add_supplier(supplier_data)
    
    sample_users = [
        {"username": "admin", "email": "admin@inventory.com", "role": "admin", "password": "admin123"},
        {"username": "manager", "email": "manager@inventory.com", "role": "manager", "password": "manager123"},
        {"username": "staff", "email": "staff@inventory.com", "role": "staff", "password": "staff123"},
    ]
    
    for user_data in sample_users:
        add_user(user_data)
    
    for _ in range(20):
        item_id = random.randint(1, len(sample_items))
        quantity = random.randint(1, 5)
        transaction_type = random.choice(["purchase", "sale"])
        item = items_db.get(item_id)
        if item:
            price_per_unit = item["price"]
            total_price = price_per_unit * quantity
            
            transaction_data = {
                "item_id": item_id,
                "quantity": quantity,
                "transaction_type": transaction_type,
                "price_per_unit": price_per_unit,
                "total_price": total_price
            }
            
            add_transaction(transaction_data)
            
            if transaction_type == "purchase":
                item["quantity"] += quantity
            else:  # sale
                item["quantity"] = max(0, item["quantity"] - quantity)

def add_item(item_data: dict) -> dict:
    global item_id_counter
    item_id = item_id_counter
    item_id_counter += 1
    
    now = datetime.now()
    item = {
        "id": item_id,
        "created_at": now,
        "updated_at": now,
        **item_data
    }
    
    items_db[item_id] = item
    return item

def get_item(item_id: int) -> Optional[dict]:
    return items_db.get(item_id)

def get_all_items() -> List[dict]:
    return list(items_db.values())

def update_item(item_id: int, item_data: dict) -> Optional[dict]:
    if item_id not in items_db:
        return None
    
    item = items_db[item_id]
    for key, value in item_data.items():
        if key not in ["id", "created_at"]:
            item[key] = value
    
    item["updated_at"] = datetime.now()
    return item

def delete_item(item_id: int) -> bool:
    if item_id not in items_db:
        return False
    
    del items_db[item_id]
    return True

def add_transaction(transaction_data: dict) -> dict:
    global transaction_id_counter
    transaction_id = transaction_id_counter
    transaction_id_counter += 1
    
    now = datetime.now()
    transaction = {
        "id": transaction_id,
        "created_at": now,
        **transaction_data
    }
    
    transactions_db[transaction_id] = transaction
    return transaction

def get_transaction(transaction_id: int) -> Optional[dict]:
    return transactions_db.get(transaction_id)

def get_all_transactions() -> List[dict]:
    return list(transactions_db.values())

def add_supplier(supplier_data: dict) -> dict:
    global supplier_id_counter
    supplier_id = supplier_id_counter
    supplier_id_counter += 1
    
    now = datetime.now()
    supplier = {
        "id": supplier_id,
        "created_at": now,
        "updated_at": now,
        **supplier_data
    }
    
    suppliers_db[supplier_id] = supplier
    return supplier

def get_supplier(supplier_id: int) -> Optional[dict]:
    return suppliers_db.get(supplier_id)

def get_all_suppliers() -> List[dict]:
    return list(suppliers_db.values())

def update_supplier(supplier_id: int, supplier_data: dict) -> Optional[dict]:
    if supplier_id not in suppliers_db:
        return None
    
    supplier = suppliers_db[supplier_id]
    for key, value in supplier_data.items():
        if key not in ["id", "created_at"]:
            supplier[key] = value
    
    supplier["updated_at"] = datetime.now()
    return supplier

def delete_supplier(supplier_id: int) -> bool:
    if supplier_id not in suppliers_db:
        return False
    
    del suppliers_db[supplier_id]
    return True

def add_user(user_data: dict) -> dict:
    global user_id_counter
    user_id = user_id_counter
    user_id_counter += 1
    
    now = datetime.now()
    user = {
        "id": user_id,
        "created_at": now,
        "updated_at": now,
        "username": user_data["username"],
        "email": user_data["email"],
        "role": user_data.get("role", "staff"),
        "password": user_data["password"]  # In a real app, this would be hashed
    }
    
    users_db[user_id] = user
    return user

def get_user(user_id: int) -> Optional[dict]:
    return users_db.get(user_id)

def get_user_by_username(username: str) -> Optional[dict]:
    for user in users_db.values():
        if user["username"] == username:
            return user
    return None

def get_all_users() -> List[dict]:
    return list(users_db.values())

def get_analytics_data() -> dict:
    total_sales = 0
    total_purchases = 0
    
    for transaction in transactions_db.values():
        if transaction["transaction_type"] == "sale":
            total_sales += transaction["total_price"]
        else:  # purchase
            total_purchases += transaction["total_price"]
    
    profit = total_sales - total_purchases
    
    low_stock_items = [item for item in items_db.values() if item["quantity"] < 10]
    
    item_sales = {}
    for transaction in transactions_db.values():
        if transaction["transaction_type"] == "sale":
            item_id = transaction["item_id"]
            if item_id in item_sales:
                item_sales[item_id] += transaction["quantity"]
            else:
                item_sales[item_id] = transaction["quantity"]
    
    top_selling_item_ids = sorted(item_sales.keys(), key=lambda x: item_sales[x], reverse=True)[:5]
    top_selling_items = [items_db[item_id] for item_id in top_selling_item_ids if item_id in items_db]
    
    return {
        "total_sales": total_sales,
        "total_purchases": total_purchases,
        "profit": profit,
        "low_stock_items": low_stock_items,
        "top_selling_items": top_selling_items
    }

init_sample_data()
