from app.database import engine, Base
from app.models import Patient, Doctor, Appointment

# Drop all tables
print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("✓ All tables dropped successfully!")
