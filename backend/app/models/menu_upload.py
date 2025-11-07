from datetime import datetime, timezone
from sqlalchemy import ForeignKey, Integer, String, DateTime
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.extensions import db
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.models import User


class MenuUpload(db.Model):
    __tablename__ = 'menu_uploads'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    upload_name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    analysis_result: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False)
    user: Mapped['User'] = relationship('User', back_populates='uploads')

    def __init__(self, user_id: int, upload_name: str, analysis_result: list[dict[str, Any]]):
        self.user_id = user_id
        self.upload_name = upload_name
        self.analysis_result = analysis_result

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'upload_name': self.upload_name,
            'created_at': self.created_at.isoformat(),
            'analysis_result': self.analysis_result
        }

    def __repr__(self) -> str:
        return f'<MenuUpload id={self.id} user_id={self.user_id} upload_name={self.upload_name} created_at={self.created_at.isoformat()}'