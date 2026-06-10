from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.rag_service import get_rag_response

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
def chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
    request: Request=None
):
    answer = get_rag_response(
        question=data.question,
        document_id=data.document_id,
        user_id=request.state.user_id,
        db=db
    )
    return ChatResponse(
        answer=answer,
        document_id=data.document_id
    )
@router.post("/", response_model=ChatResponse)
def chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
    request: Request=None
):
    print(f"document_id: {data.document_id}")  # ← add karo
    print(f"question: {data.question}")         # ← add karo
    print(f"user_id: {request.state.user_id}")  # ← add karo
    
    try:
        answer = get_rag_response(
            question=data.question,
            document_id=data.document_id,
            user_id=request.state.user_id,
            db=db
        )
        return ChatResponse(
            answer=answer,
            document_id=data.document_id
        )
    except Exception as e:
        print(f"ERROR: {e}")  # ← add karo
        raise