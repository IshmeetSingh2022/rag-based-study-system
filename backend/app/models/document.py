from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, timezone
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))