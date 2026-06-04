
from app.core.database import SessionLocal

def get_db():
    db=SessionLocal()
    try:
        yield db
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()