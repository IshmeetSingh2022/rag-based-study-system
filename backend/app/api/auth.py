from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.schemas import SignUpRequest, LoginRequest
from app.dependencies.db import get_db
from app.services.auth_service import signup_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(data: SignUpRequest, db: Session = Depends(get_db)):
    return signup_user(data, db)

@router.post("/login", response_model=LoginRequest)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(data, db)