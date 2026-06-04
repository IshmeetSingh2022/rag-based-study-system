from app.schemas.schemas import SignUpRequest,LoginRequest
from sqlalchemy.orm import Session
from app.models.user import User
from fastapi import HTTPException
from app.core.security import hash_password,verify_password,create_access_token
def signup_user(data:SignUpRequest,db:Session):
    existing_user=db.query(User).filter(User.username==data.username).first()
    if existing_user:
        raise HTTPException(staus_code=400,detail="Username already exists")
    hashed=hash_password(data.password)

    new_user=User(
        username=data.username,
        password=hashed
    )
    db.add(new_user)
    db.commit(new_user)
    return {"message":"User created succesfully"}

def login_user(data:LoginRequest,db:Session):
    user=db.query(User).filter(User.username==data.username).first()

    if not user or not verify_password(data.password,user.password):
        return HTTPException(status_code=401,detail="Invalid Credential")
    
    token=create_access_token(
        data={
            "sub":user.username,
            "user_id":user.id
        }
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }


