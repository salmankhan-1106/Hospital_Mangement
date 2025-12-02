from sqlalchemy.orm import Session
from models import Appointment
from schemas import AppointmentCreate, AppointmentUpdate
from uuid import UUID

def create_appointment(db: Session, appointment: AppointmentCreate, patient_id: UUID):
    """Create a new appointment for a patient"""
    db_appointment = Appointment(
        patient_id=patient_id,
        doctor_id=appointment.doctor_id,
        problem=appointment.problem,
        status='pending'
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointment_by_code(db: Session, appointment_code: str):
    """Get appointment by appointment code"""
    return db.query(Appointment).filter(Appointment.appointment_code == appointment_code).first()

def get_appointment_by_id(db: Session, appointment_id: UUID):
    """Get appointment by ID"""
    return db.query(Appointment).filter(Appointment.id == appointment_id).first()

def get_patient_appointments(db: Session, patient_id: UUID, skip: int = 0, limit: int = 100):
    """Get all appointments for a patient"""
    return db.query(Appointment).filter(
        Appointment.patient_id == patient_id
    ).offset(skip).limit(limit).all()

def get_doctor_appointments(db: Session, doctor_id: UUID, skip: int = 0, limit: int = 100):
    """Get all appointments for a doctor"""
    return db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id
    ).offset(skip).limit(limit).all()

def get_all_appointments(db: Session, skip: int = 0, limit: int = 100):
    """Get all appointments"""
    return db.query(Appointment).offset(skip).limit(limit).all()

def update_appointment(db: Session, appointment_id: UUID, appointment: AppointmentUpdate):
    """Update an appointment (doctor adds result and changes status)"""
    db_appointment = get_appointment_by_id(db, appointment_id)
    if not db_appointment:
        return None
    
    if appointment.result is not None:
        db_appointment.result = appointment.result
    if appointment.status is not None:
        db_appointment.status = appointment.status
    
    db.commit()
    db.refresh(db_appointment)
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
