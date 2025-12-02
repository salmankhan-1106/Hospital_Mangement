from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from database import get_db
from models import Patient, Doctor
from schemas import PatientResponse, DoctorResponse
from crud.users import get_all_doctors
from routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Patients & Doctors"])

@router.get("/doctors", response_model=List[DoctorResponse])
async def get_doctors(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get list of all doctors (public access for patients to book appointments)"""
    doctors = get_all_doctors(db, skip, limit)
    return doctors

@router.get("/patients/me", response_model=PatientResponse)
async def get_my_patient_profile(
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current patient's profile"""
    if not isinstance(current_user, Patient):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access this endpoint"
        )
    return current_user

@router.get("/doctors/me", response_model=DoctorResponse)
async def get_my_doctor_profile(
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current doctor's profile"""
    if not isinstance(current_user, Doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can access this endpoint"
        )
    return current_user
