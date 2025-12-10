from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from app.database import get_db
from app.models import Patient, Doctor
from app.schemas import PatientResponse, DoctorResponse, DoctorUpdate
from app.crud.users import get_all_doctors
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Patients & Doctors"])

@router.get("/doctors", response_model=List[DoctorResponse])
async def get_doctors(
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get list of all doctors (only for patients to book appointments)"""
    if not isinstance(current_user, Patient):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can view doctor list"
        )
    doctors = get_all_doctors(db, skip, limit)
    return doctors

## Removed endpoint for doctors to view all patients (privacy)

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

@router.put("/doctors/me", response_model=DoctorResponse)
async def update_my_doctor_profile(
    profile_update: DoctorUpdate,
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current doctor's profile"""
    if not isinstance(current_user, Doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can access this endpoint"
        )
    
    # Update only provided fields
    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user