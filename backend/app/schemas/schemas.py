from pydantic import BaseModel, field_validator



class SignUpRequest(BaseModel):         
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_must_be_valid(cls, v):
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Username should contain atleast 3 characters")
        return v

    @field_validator("password")
    @classmethod
    def password_must_be_strong(cls, v):
        if len(v) < 6:
            raise ValueError("Password should contain atleast 6 characters")
        return v


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int                          
    username: str




class DocumentResponse(BaseModel):
    id: int
    filename: str
    subject: str
    chunk_count: int

    class Config:
        from_attributes = True           




class ChatRequest(BaseModel):
    document_id: int
    question: str

class ChatResponse(BaseModel):
    answer: str
    document_id: int