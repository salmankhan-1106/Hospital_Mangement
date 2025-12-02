from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Union

from database import get_db
from models import Patient, Doctor
from schemas import (
    Token, 
    PatientCreate, 
    PatientLogin, 
    DoctorCreate, 
    DoctorLogin,
    PatientResponse,
    DoctorResponse
)
from crud.users import (
    authenticate_patient,
    authenticate_doctor,
    create_patient,
    create_doctor,
    get_patient_by_contact,
    get_doctor_by_email
)
from utils import create_access_token, verify_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Union[Patient, Doctor]:
    """Get current authenticated user (patient or doctor) from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    identifier: str = payload.get("sub")
    user_type: str = payload.get("type")
    
    if identifier is None or user_type is None:
        raise credentials_exception
    
    # Check if patient or doctor
    if user_type == "patient":
        user = get_patient_by_contact(db, contact=identifier)
    elif user_type == "doctor":
        user = get_doctor_by_email(db, email=identifier)
    else:
        raise credentials_exception
    
    if user is None:
        raise credentials_exception
    
    return user

@router.post("/login/patient", response_model=dict)
async def login_patient(credentials: PatientLogin, db: Session = Depends(get_db)):
    """Login endpoint for patients using contact"""
    patient = authenticate_patient(db, credentials.contact, credentials.password)
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect contact or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token with patient contact and type
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": patient.contact, "type": "patient"},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(patient.id),
            "name": patient.name,
            "contact": patient.contact,
            "type": "patient"
        }
    }

@router.post("/login/doctor", response_model=dict)
async def login_doctor(credentials: DoctorLogin, db: Session = Depends(get_db)):
    """Login endpoint for doctors using email"""
    doctor = authenticate_doctor(db, credentials.email, credentials.password)
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token with doctor email and type
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": doctor.email, "type": "doctor"},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(doctor.id),
            "name": doctor.name,
            "email": doctor.email,
            "qualification": doctor.qualification,
            "type": "doctor"
        }
    }

@router.post("/register/patient", response_model=dict)
async def register_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    """Register a new patient"""
    # Check if contact already exists
    if get_patient_by_contact(db, patient.contact):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact number already registered"
        )
    
    try:
        db_patient = create_patient(db, patient)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_patient.contact, "type": "patient"},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(db_patient.id),
                "name": db_patient.name,
                "contact": db_patient.contact,
                "type": "patient"
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating patient: {str(e)}"
        )

@router.post("/register/doctor", response_model=dict)
async def register_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    """Register a new doctor (requires secret key 123$)"""
    # Check if email already exists
    if get_doctor_by_email(db, doctor.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        db_doctor = create_doctor(db, doctor)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_doctor.email, "type": "doctor"},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(db_doctor.id),
                "name": db_doctor.name,
                "email": db_doctor.email,
                "qualification": db_doctor.qualification,
                "type": "doctor"
            }
        }
    except Exception as e:
        db.rollback()
        error_msg = str(e).lower()
        
        if "duplicate key" in error_msg and "email" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered. Please use a different email."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating doctor account: {str(e)}"
            )

@router.get("/me/patient", response_model=PatientResponse)
async def read_patient_me(current_user: Patient = Depends(get_current_user)):
    """Get current patient information"""
    if not isinstance(current_user, Patient):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a patient account"
        )
    return current_user

@router.get("/me/doctor", response_model=DoctorResponse)
async def read_doctor_me(current_user: Doctor = Depends(get_current_user)):
    """Get current doctor information"""
    if not isinstance(current_user, Doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a doctor account"
        )
    return current_user

@router.post("/logout")
async def logout():
    """Logout endpoint (client should delete token)"""
    return {"message": "Logged out successfully"}
