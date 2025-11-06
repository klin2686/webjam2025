from app import create_app
from app.extensions import db
from app.models import Allergen, STANDARD_ALLERGENS
from sqlalchemy import select


app = create_app()
with app.app_context():
    for allergen_name in STANDARD_ALLERGENS:
        stmt = select(Allergen).where(Allergen.name == allergen_name)
        exists = db.session.execute(stmt).scalar_one_or_none()
        if not exists:
            db.session.add(Allergen(name=allergen_name))
    db.session.commit()
    print(f"Standard allergens seeded! {len(STANDARD_ALLERGENS)} allergens added to database.")