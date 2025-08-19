import uuid
from fastapi import UploadFile, HTTPException
from pathlib import Path
from app.config import UPLOAD_DIRECTORY
import shutil
import os

async def save_upload_file(upload_file: UploadFile) -> str:
    """Save an uploaded file and return the filename"""
    if not upload_file.filename:
        raise HTTPException(status_code=400, detail="No file name provided")
    
    # Generate unique filename
    file_extension = Path(upload_file.filename).suffix
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIRECTORY / new_filename
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    finally:
        upload_file.file.close()
    
    return f"/uploads/{new_filename}"