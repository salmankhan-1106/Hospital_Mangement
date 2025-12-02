from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, appointments, patients

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hospital Management System",
    description="Backend API for Hospital Management System",
    version="1.0.0"
)

# Configure CORS - must be before including routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(patients.router)

@app.get("/")
async def root():
    return {"message": "Hospital Management System API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/test-db")
async def test_database():
    """Test database connection and check if tables exist"""
    from database import SessionLocal
    from sqlalchemy import text
    
    db = SessionLocal()
    try:
        # Test basic connection
        result = db.execute(text("SELECT 1")).scalar()
        
        # Check if config table exists and has data
        config_check = db.execute(text("SELECT COUNT(*) FROM config")).scalar()
        
        # Check if patients table exists
        patients_count = db.execute(text("SELECT COUNT(*) FROM patients")).scalar()
        
        # Check if doctors table exists
        doctors_count = db.execute(text("SELECT COUNT(*) FROM doctors")).scalar()
        
        # Check if appointments table exists
        appointments_count = db.execute(text("SELECT COUNT(*) FROM appointments")).scalar()
        
        return {
            "database_connected": True,
            "connection_test": result == 1,
            "config_table_rows": config_check,
            "patients_count": patients_count,
            "doctors_count": doctors_count,
            "appointments_count": appointments_count,
            "message": "Database is connected and all tables exist!"
        }
    except Exception as e:
        return {
            "database_connected": False,
            "error": str(e)
        }
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
