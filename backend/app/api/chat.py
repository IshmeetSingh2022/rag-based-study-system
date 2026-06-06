from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.rag_service import get_rag_response
from app.middleware.auth import get_current_user
from fastapi import Request
router=APIRouter(prefix="chat",tags=["Chat"])

@router.post("/",response_model=ChatResponse)
def chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
    request:Request=None
):
    answer=get_rag_response(
        question=data.question,
        document_id=data.document_id,
        user_id=request.state.user_id
        db=db
    )
    return ChatResponse(
        answer=answer,
        document_id=data.document_id
    )