from sqlalchemy.orm import Session, joinedload
from app.models import Appointment
from app.schemas import AppointmentCreate, AppointmentUpdate
from uuid import UUID, uuid4
import random
import string

def generate_appointment_code():
    """Generate a unique appointment code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def create_appointment(db: Session, appointment: AppointmentCreate, patient_id: UUID):
    """Create a new appointment for a patient"""
    # Generate unique appointment code
    appointment_code = generate_appointment_code()
    while db.query(Appointment).filter(Appointment.appointment_code == appointment_code).first():
        appointment_code = generate_appointment_code()
    
    db_appointment = Appointment(
        appointment_code=appointment_code,
        patient_id=patient_id,
        doctor_id=appointment.doctor_id,
        problem=appointment.problem,
        severity=appointment.severity,
        duration=appointment.duration,
        medical_history=appointment.medical_history,
        status='pending'
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointment_by_code(db: Session, appointment_code: str):
    """Get appointment by appointment code"""
    return db.query(Appointment).options(
        joinedload(Appointment.patient),
        joinedload(Appointment.doctor)
    ).filter(Appointment.appointment_code == appointment_code).first()

def get_appointment_by_id(db: Session, appointment_id: UUID):
    """Get appointment by ID"""
    return db.query(Appointment).options(
        joinedload(Appointment.patient),
        joinedload(Appointment.doctor)
    ).filter(Appointment.id == appointment_id).first()

def get_patient_appointments(db: Session, patient_id: UUID, skip: int = 0, limit: int = 100):
    """Get all appointments for a patient"""
    return db.query(Appointment).options(
        joinedload(Appointment.patient),
        joinedload(Appointment.doctor)
    ).filter(
        Appointment.patient_id == patient_id
    ).offset(skip).limit(limit).all()

def get_doctor_appointments(db: Session, doctor_id: UUID, skip: int = 0, limit: int = 100):
    """Get all appointments for a doctor"""
    return db.query(Appointment).options(
        joinedload(Appointment.patient),
        joinedload(Appointment.doctor)
    ).filter(
        Appointment.doctor_id == doctor_id
    ).offset(skip).limit(limit).all()

def get_all_appointments(db: Session, skip: int = 0, limit: int = 100):
    """Get all appointments"""
    return db.query(Appointment).options(
        joinedload(Appointment.patient),
        joinedload(Appointment.doctor)
    ).offset(skip).limit(limit).all()

def update_appointment(db: Session, appointment_id: UUID, appointment: AppointmentUpdate):
    """Update an appointment (doctor adds result and changes status)"""
    db_appointment = get_appointment_by_id(db, appointment_id)
    if not db_appointment:
        return None
    
    print(f"[APPOINTMENT UPDATE] Before - Status: {db_appointment.status}, Result: {db_appointment.result}")
    
    if appointment.result is not None:
        db_appointment.result = appointment.result
    if appointment.status is not None:
        db_appointment.status = appointment.status
    if appointment.cancellation_reason is not None:
        db_appointment.cancellation_reason = appointment.cancellation_reason
    
    print(f"[APPOINTMENT UPDATE] After - Status: {db_appointment.status}, Result: {db_appointment.result}")
    
    db.commit()
    db.refresh(db_appointment)
    
    print(f"[APPOINTMENT UPDATE] Committed - Status: {db_appointment.status}")
    
    return db_appointment

def cancel_appointment(db: Session, appointment_id: UUID):
    """Cancel an appointment"""
    db_appointment = get_appointment_by_id(db, appointment_id)
    if not db_appointment:
        return None
    
    db_appointment.status = 'cancelled'
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

