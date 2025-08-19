from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.database import db
from app.models.user import User
from app.models.product import Product, ProductCreate, ProductUpdate
from app.utils.auth_utils import get_current_user
from datetime import datetime
from bson import ObjectId
from pymongo import DESCENDING

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=List[Product])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    # Build query based on filters
    query = {}
    if category:
        query["category"] = category
    if search:
        query["$text"] = {"$search": search}
    
    # Execute query with pagination
    cursor = db.db.products.find(query).skip(skip).limit(limit).sort("created_at", DESCENDING)
    products = await cursor.to_list(length=limit)
    return products

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str, current_user: User = Depends(get_current_user)):
    product = await db.db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product