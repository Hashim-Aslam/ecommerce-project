from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import db
from app.models.user import User
from app.models.order import Order, OrderCreate, OrderStatus
from app.utils.auth_utils import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=List[Order])
async def get_orders(current_user: User = Depends(get_current_user)):
    orders = await db.db.orders.find({"user_id": current_user.id}).sort("created_at", -1).to_list(None)
    return orders

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: User = Depends(get_current_user)):
    order = await db.db.orders.find_one({"_id": order_id, "user_id": current_user.id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/checkout", response_model=Order)
async def checkout(order_create: OrderCreate, current_user: User = Depends(get_current_user)):
    # Get user's cart
    cart = await db.db.carts.find_one({"user_id": current_user.id})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total
    total = sum(item["price"] * item["quantity"] for item in cart["items"])
    
    # Check stock for each product
    for item in cart["items"]:
        product = await db.db.products.find_one({"_id": item["product_id"]})
        if not product or product["stock"] < item["quantity"]:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product: {item['name']}")
    
    # Create order
    now = datetime.utcnow()
    new_order = {
        "_id": str(ObjectId()),
        "user_id": current_user.id,
        "items": cart["items"],
        "total": total,
        "status": OrderStatus.PENDING,
        "shipping_address": order_create.shipping_address.model_dump(),
        "created_at": now,
        "updated_at": now
    }
    
    await db.db.orders.insert_one(new_order)
    
    # Update product stock
    for item in cart["items"]:
        await db.db.products.update_one(
            {"_id": item["product_id"]},
            {"$inc": {"stock": -item["quantity"]}}
        )
    
    # Clear the cart
    await db.db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": [], "updated_at": now}}
    )
    
    return await db.db.orders.find_one({"_id": new_order["_id"]})