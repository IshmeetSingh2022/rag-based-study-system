from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.database import Base, engine
from app.middleware.auth import auth_middleware

from app.api import auth, documents, chat

app = FastAPI(
    title="StudyBuddy AI",
    description="RAG based study assistant",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(BaseHTTPMiddleware, dispatch=auth_middleware)


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "StudyBuddy AI backend running 🚀"}


app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(chat.router)