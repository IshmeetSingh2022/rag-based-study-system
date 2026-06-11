import os
import shutil
import uuid
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from app.models.document import Document
from app.services.pdf_service import process_pdf

UPLOAD_DIR = "./uploads"
def upload_document(
        file:UploadFile,
        subject:str,
        user_id:int,
        db:Session)->Document:
    os.makedirs(UPLOAD_DIR,exist_ok=True)

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )
    unique_filename=f"{user_id}_{uuid.uuid4()}_{file.filename}"
    file_path=os.path.join(UPLOAD_DIR,unique_filename)

    with open(file_path,"wb") as buffer:
        shutil.copyfileobj(file.file,buffer)
    

    new_doc=Document(
        user_id=user_id,
        filename=file.filename,
        subject=subject,
        file_path=file_path,
        chunk_count=0
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    chunk_count = 0
    try:
        chunk_count = process_pdf(file_path, new_doc.id)
    except Exception as e:
        print(f"PDF PROCESSING ERROR: {e}")

    new_doc.chunk_count = chunk_count
    db.commit()
    return new_doc

def get_user_documents(user_id: int, db: Session) -> list:
    return db.query(Document).filter(
        Document.user_id == user_id
    ).all()

from app.models.message import Message  # ← import add karo

def delete_document(document_id: int, user_id: int, db: Session):
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == user_id
    ).first()

    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

   
    db.query(Message).filter(
        Message.document_id == document_id
    ).delete()

    
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    
    db.delete(doc)
    db.commit()

    return {"message": "Document deleted successfully"}

    