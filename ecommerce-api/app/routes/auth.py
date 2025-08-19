from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.database import db
from app.models.user import UserCreate, User, Token, UserLogin
from app.utils.auth_utils import verify_password, get_password_hash, create_access_token, get_current_user
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=User)
async def signup(user_create: UserCreate):
    # Check if user with same email already exists
    existing_user = await db.db.users.find_one({"email": user_create.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user with hashed password
    now = datetime.utcnow()
    user_dict = user_create.model_dump()
    
    hashed_password = get_password_hash(user_dict.pop("password"))
    new_user = {
        "_id": str(ObjectId()),
        **user_dict,
        "hashed_password": hashed_password,
        "created_at": now,
        "updated_at": now
    }
    
    await db.db.users.insert_one(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Find user by email
    user = await db.db.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response):
    # Since JWT is stateless, we can only tell the client to remove the token
    # In a real application, you might want to implement token blacklisting
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=User)
async def get_user_me(current_user: User = Depends(get_current_user)):
    return current_user