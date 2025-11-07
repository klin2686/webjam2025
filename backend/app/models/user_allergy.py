from sqlalchemy import ForeignKey, Integer, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.extensions import db
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models import User, Allergen


class UserAllergy(db.Model):
    __tablename__ = 'user_allergies'
    __table_args__ = (UniqueConstraint('user_id', 'allergen_id'),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    severity: Mapped[int] = mapped_column(Integer, CheckConstraint('severity >= 1 AND severity <= 3'), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), index=True, nullable=False)
    allergen_id: Mapped[int] = mapped_column(Integer, ForeignKey('allergens.id'), index=True, nullable=False)
    user: Mapped['User'] = relationship('User', back_populates='allergens')
    allergen: Mapped['Allergen'] = relationship('Allergen', back_populates='users')

    def __init__(self, user_id: int, allergen_id: int, severity: int):
        self.user_id = user_id
        self.allergen_id = allergen_id
        self.severity = severity

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'allergen_id': self.allergen_id,
            'severity': self.severity,
            'allergen_name': self.allergen.name
        }

    def __repr__(self) -> str:
        return f'<UserAllergy user_id={self.user_id} allergen_id={self.allergen_id} severity={self.severity}>'