from fastapi import APIRouter, Depends, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.schemas.schemas import DocumentResponse
from app.services.document_service import (
    upload_document,
    get_user_documents,
    delete_document
)

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentResponse)
def upload(
    file: UploadFile = File(...),
    subject: str = Form(...),
    db: Session = Depends(get_db),
    request: Request=None
):
    return upload_document(file, subject, request.state.user_id, db)


@router.get("/", response_model=list[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    request: Request=None
):
    return get_user_documents(request.state.user_id, db)


@router.delete("/{document_id}")
def delete(
    document_id: int,
    db: Session = Depends(get_db),
    request: Request=None
):
    return delete_document(document_id, request.state.user_id, db)