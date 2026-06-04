from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, timezone
from app.core.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" ya "assistant"
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))