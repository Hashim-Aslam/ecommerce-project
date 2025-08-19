from fastapi import APIRouter, Depends, HTTPException
from app.database import db
from app.models.user import User
from app.models.cart import Cart, AddToCartRequest, CartItem
from app.utils.auth_utils import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=Cart)
async def get_cart(current_user: User = Depends(get_current_user)):
    cart = await db.db.carts.find_one({"user_id": current_user.id})
    if not cart:
        # Create empty cart if not exists
        now = datetime.utcnow()
        cart = {
            "_id": str(ObjectId()),
            "user_id": current_user.id,
            "items": [],
            "created_at": now,
            "updated_at": now
        }
        await db.db.carts.insert_one(cart)
    return cart

@router.post("/add", response_model=Cart)
async def add_to_cart(item: AddToCartRequest, current_user: User = Depends(get_current_user)):
    # Check if product exists and has stock
    product = await db.db.products.find_one({"_id": item.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["stock"] < item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")
    
    # Get or create cart
    cart = await db.db.carts.find_one({"user_id": current_user.id})
    now = datetime.utcnow()
    
    if not cart:
        # Create new cart
        cart = {
            "_id": str(ObjectId()),
            "user_id": current_user.id,
            "items": [],
            "created_at": now,
            "updated_at": now
        }
        await db.db.carts.insert_one(cart)
    
    # Check if item already in cart
    cart_item_exists = False
    for cart_item in cart.get("items", []):
        if cart_item["product_id"] == item.product_id:
            cart_item["quantity"] += item.quantity
            cart_item_exists = True
            break
    
    if not cart_item_exists:
        # Add new item to cart
        cart_item = CartItem(
            product_id=product["_id"],
            name=product["name"],
            price=product["price"],
            quantity=item.quantity
        )
        cart.setdefault("items", []).append(cart_item.model_dump())
    
    # Update cart
    await db.db.carts.update_one(
        {"_id": cart["_id"]},
        {
            "$set": {
                "items": cart["items"],
                "updated_at": now
            }
        }
    )
    
    return await db.db.carts.find_one({"_id": cart["_id"]})

@router.post("/remove/{product_id}", response_model=Cart)
async def remove_from_cart(product_id: str, current_user: User = Depends(get_current_user)):
    cart = await db.db.carts.find_one({"user_id": current_user.id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Filter out the item to remove
    cart["items"] = [item for item in cart["items"] if item["product_id"] != product_id]
    
    # Update cart
    await db.db.carts.update_one(
        {"_id": cart["_id"]},
        {
            "$set": {
                "items": cart["items"],
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return await db.db.carts.find_one({"_id": cart["_id"]})

@router.post("/clear", response_model=Cart)
async def clear_cart(current_user: User = Depends(get_current_user)):
    cart = await db.db.carts.find_one({"user_id": current_user.id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Clear cart items
    await db.db.carts.update_one(
        {"_id": cart["_id"]},
        {
            "$set": {
                "items": [],
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return await db.db.carts.find_one({"_id": cart["_id"]})