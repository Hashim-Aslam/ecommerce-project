from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int

class ShippingAddress(BaseModel):
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str

class OrderCreate(BaseModel):
    shipping_address: ShippingAddress

class Order(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    items: List[OrderItem]
    total: float
    status: OrderStatus = OrderStatus.PENDING
    shipping_address: ShippingAddress
    created_at: datetime
    updated_at: datetime

class OrderStatusUpdate(BaseModel):
    status: OrderStatus