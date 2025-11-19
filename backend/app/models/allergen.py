from typing import TYPE_CHECKING

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db

if TYPE_CHECKING:
    from app.models import UserAllergy

STANDARD_ALLERGENS = {
    'Milk',
    'Eggs',
    'Fish',
    'Shellfish',
    'Tree Nuts',
    'Peanuts',
    'Wheat',
    'Soybeans',
    'Sesame',
}


class Allergen(db.Model):
    __tablename__ = 'allergens'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    users: Mapped[list['UserAllergy']] = relationship(
        'UserAllergy', back_populates='allergen', cascade='all, delete-orphan'
    )

    def __init__(self, name: str):
        self.name = name

    def to_dict(self) -> dict:
        return {'id': self.id, 'name': self.name}

    def __repr__(self) -> str:
        return f'<Allergen {self.name}>'
