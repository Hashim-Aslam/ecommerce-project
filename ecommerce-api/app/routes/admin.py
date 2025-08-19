from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List, Optional
from app.database import db
from app.models.user import User
from app.models.product import Product, ProductCreate, ProductUpdate
from app.models.order import Order, OrderStatusUpdate
from app.utils.auth_utils import get_current_admin
from app.utils.file_upload import save_upload_file
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["Admin"])

# Product management routes
@router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, current_user: User = Depends(get_current_admin)):
    now = datetime.utcnow()
    new_product = {
        "_id": str(ObjectId()),
        **product.model_dump(),
        "created_at": now,
        "updated_at": now
    }
    
    await db.db.products.insert_one(new_product)
    return new_product

@router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str, 
    product_update: ProductUpdate, 
    current_user: User = Depends(get_current_admin)
):
    # Check if product exists
    product = await db.db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update product
    update_data = {
        k: v for k, v in product_update.model_dump(exclude_unset=True).items() 
        if v is not None
    }
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.db.products.update_one(
            {"_id": product_id},
            {"$set": update_data}
        )
    
    return await db.db.products.find_one({"_id": product_id})

@router.delete("/products/{product_id}")
async def delete_product(product_id: str, current_user: User = Depends(get_current_admin)):
    product = await db.db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.db.products.delete_one({"_id": product_id})
    return {"message": "Product deleted successfully"}

@router.post("/products/{product_id}/upload-image", response_model=Product)
async def upload_product_image(
    product_id: str, 
    image: UploadFile = File(...), 
    current_user: User = Depends(get_current_admin)
):
    # Check if product exists
    product = await db.db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Upload image
    image_path = await save_upload_file(image)
    
    # Update product with image URL
    await db.db.products.update_one(
        {"_id": product_id},
        {"$set": {"image_url": image_path, "updated_at": datetime.utcnow()}}
    )
    
    return await db.db.products.find_one({"_id": product_id})

# Order management routes
@router.get("/orders", response_model=List[Order])
async def get_all_orders(current_user: User = Depends(get_current_admin)):
    orders = await db.db.orders.find().sort("created_at", -1).to_list(None)
    return orders

@router.put("/orders/{order_id}/status", response_model=Order)
async def update_order_status(
    order_id: str, 
    status_update: OrderStatusUpdate, 
    current_user: User = Depends(get_current_admin)
):
    # Check if order exists
    order = await db.db.orders.find_one({"_id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Update order status
    await db.db.orders.update_one(
        {"_id": order_id},
        {
            "$set": {
                "status": status_update.status,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return await db.db.orders.find_one({"_id": order_id})