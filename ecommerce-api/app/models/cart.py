from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class CartItem(BaseModel):
    product_id: str
    quantity: int
    name: str
    price: float

class Cart(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    items: List[CartItem] = []
    created_at: datetime
    updated_at: datetime

class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int