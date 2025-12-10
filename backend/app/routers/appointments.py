from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from app.database import get_db
from app.models import Patient, Doctor, Appointment
from app.schemas import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
    AppointmentCodeLookup
)
from app.crud.appointments import (
    create_appointment,
    get_appointment_by_code,
    get_appointment_by_id,
    get_patient_appointments,
    get_doctor_appointments,
    get_all_appointments,
    update_appointment,
    cancel_appointment
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.post("/", response_model=AppointmentResponse)
async def create_new_appointment(
    appointment: AppointmentCreate,
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appointment (patient only)"""
    if not isinstance(current_user, Patient):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can create appointments"
        )
    
    try:
        db_appointment = create_appointment(db, appointment, current_user.id)
        return db_appointment
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating appointment: {str(e)}"
        )

@router.get("/code/{appointment_code}", response_model=AppointmentResponse)
async def get_appointment_by_code_route(
    appointment_code: str,
    db: Session = Depends(get_db)
):
    """Get appointment by appointment code (public access for patients to check status)"""
    appointment = get_appointment_by_code(db, appointment_code)
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    return appointment

@router.get("/my", response_model=List[AppointmentResponse])
async def get_my_appointments(
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get appointments for current user (patient or doctor)"""
    if isinstance(current_user, Patient):
        appointments = get_patient_appointments(db, current_user.id, skip, limit)
    elif isinstance(current_user, Doctor):
        appointments = get_doctor_appointments(db, current_user.id, skip, limit)
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid user type"
        )
    
    return appointments

@router.get("/all", response_model=List[AppointmentResponse])
async def get_all_appointments_route(
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all appointments (admin/doctor only)"""
    if not isinstance(current_user, Doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can view all appointments"
        )
    
    appointments = get_all_appointments(db, skip, limit)
    return appointments

@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment_route(
    appointment_id: str,
    appointment: AppointmentUpdate,
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update appointment (doctor only - add result and change status)"""
    print(f"\n[ROUTER] Update appointment request - ID: {appointment_id}, Status: {appointment.status}, Result: {appointment.result}")
    
    if not isinstance(current_user, Doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can update appointments"
        )
    
    try:
        from uuid import UUID
        appointment_uuid = UUID(appointment_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID format"
        )
    
    db_appointment = update_appointment(db, appointment_uuid, appointment)
    if not db_appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    print(f"[ROUTER] Update successful - New status: {db_appointment.status}")
    return db_appointment

@router.delete("/{appointment_id}", response_model=AppointmentResponse)
async def cancel_appointment_route(
    appointment_id: str,
    current_user: Union[Patient, Doctor] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel appointment (patient or doctor)"""
    try:
        from uuid import UUID
        appointment_uuid = UUID(appointment_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID format"
        )
    
    # Check if appointment exists and belongs to current patient (if patient)
    db_appointment = get_appointment_by_id(db, appointment_uuid)
    if not db_appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Patients can only cancel their own appointments
    if isinstance(current_user, Patient) and db_appointment.patient_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only cancel your own appointments"
        )
    
    cancelled_appointment = cancel_appointment(db, appointment_uuid)
    return cancelled_appointment
