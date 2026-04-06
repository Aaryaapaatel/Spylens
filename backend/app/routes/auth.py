from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def signup(request: SignupRequest):
    try:
        return {
            "success": True,
            "message": "Account created successfully",
            "user": {
                "email": request.email,
                "full_name": request.full_name
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(request: LoginRequest):
    try:
        return {
            "success": True,
            "message": "Login successful",
            "token": "demo_token_123"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))