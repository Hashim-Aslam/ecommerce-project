# from motor.motor_asyncio import AsyncIOMotorClient
# from pymongo import ASCENDING, TEXT
# from dotenv import load_dotenv
# import os

# load_dotenv()

# MONGODB_URL = os.getenv("MONGODB_URL")
# DB_NAME = os.getenv("DB_NAME")

# class Database:
#     client = None
#     db = None

# db = Database()

# async def connect_to_mongo():
#     db.client = AsyncIOMotorClient(MONGODB_URL)
#     db.db = db.client[DB_NAME]
    
#     # Create indexes
#     await db.db.products.create_index([("name", TEXT), ("category", TEXT)])
#     await db.db.users.create_index([("email", ASCENDING)], unique=True)

# async def close_mongo_connection():
#     if db.client:
#         db.client.close()

# chat gpt code

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, TEXT
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME")

class Database:
    client = None
    db = None

db = Database()

async def connect_to_mongo():
    try:
        db.client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        db.db = db.client[DB_NAME]

        # Force a connection check
        await db.client.server_info()

        # Create indexes (runs once on startup)
        await db.db.products.create_index([("name", TEXT), ("category", TEXT)])
        await db.db.users.create_index([("email", ASCENDING)], unique=True)

        print("✅ Connected to MongoDB Atlas")
    except Exception as e:
        print("❌ MongoDB connection error:", e)

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("🔌 MongoDB connection closed")
