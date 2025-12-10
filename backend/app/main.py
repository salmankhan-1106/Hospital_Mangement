from fastapi import FastAPI, Depends
import logging
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import Base, SessionLocal, engine
from app.routers import appointments, auth, patients
# Import all models so SQLAlchemy can create the tables
from app import models


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hospital Management System",
    description="Backend API for Hospital Management System",
    version="1.0.0"
)

# Configure basic logging for debugging auth issues
logging.basicConfig(level=logging.DEBUG)

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
    from sqlalchemy import text
    
    db = SessionLocal()
@app.get("/init-db")
async def init_database():
    """Initialize database tables (safe to call multiple times)"""
    try:
        Base.metadata.create_all(bind=engine)
        return {
            "status": "success",
            "message": "Database tables initialized/updated successfully!"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)