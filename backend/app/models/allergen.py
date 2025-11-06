from typing import List
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.extensions import db
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models import UserAllergy

STANDARD_ALLERGENS = {"milk", "eggs", 'fish', 'shellfish', 'tree nuts', 'peanuts', 'wheat', 'soybeans', 'sesame'}


class Allergen(db.Model):
    __tablename__ = 'allergens'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    users: Mapped[List['UserAllergy']] = relationship('UserAllergy', back_populates='allergen', cascade='all, delete-orphan')

    def __init__(self, name: str):
        self.name = name

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name
        }

    def __repr__(self) -> str:
        return f'<Allergen {self.name}>'