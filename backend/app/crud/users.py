import logging
from sqlalchemy.orm import Session
from app.models import Patient, Doctor
from app.schemas import PatientCreate, DoctorCreate
from app.utils import get_password_hash, verify_password
from uuid import UUID

# Patient CRUD operations
def get_patient_by_contact(db: Session, contact: str):
    """Get patient by contact"""
    return db.query(Patient).filter(Patient.contact == contact).first()

def get_patient_by_id(db: Session, patient_id: UUID):
    """Get patient by ID"""
    return db.query(Patient).filter(Patient.id == patient_id).first()

def create_patient(db: Session, patient: PatientCreate):
    """Create a new patient"""
    db_patient = Patient(
        name=patient.name,
        contact=patient.contact,
        password_hash=get_password_hash(patient.password)
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def authenticate_patient(db: Session, contact: str, password: str):
    """Authenticate patient with contact and password"""
    logger = logging.getLogger(__name__)
    logger.debug("Authenticating patient with contact=%s", contact)
    patient = get_patient_by_contact(db, contact)
    if not patient:
        logger.debug("Patient not found: %s", contact)
        return False

    # Handle case where password_hash might be None or empty
    if not patient.password_hash:
        logger.debug("Patient has no password_hash set: %s", contact)
        return False

    if not verify_password(password, patient.password_hash):
        logger.debug("Password verification failed for patient: %s", contact)
        return False
    return patient

# Doctor CRUD operations
def get_doctor_by_email(db: Session, email: str):
    """Get doctor by email"""
    return db.query(Doctor).filter(Doctor.email == email).first()

def get_doctor_by_id(db: Session, doctor_id: UUID):
    """Get doctor by ID"""
    return db.query(Doctor).filter(Doctor.id == doctor_id).first()

def get_all_doctors(db: Session, skip: int = 0, limit: int = 100):
    """Get all doctors"""
    return db.query(Doctor).offset(skip).limit(limit).all()

def create_doctor(db: Session, doctor: DoctorCreate):
    """Create a new doctor (secret key already validated in frontend)"""
    db_doctor = Doctor(
        name=doctor.name,
        email=doctor.email,
        password_hash=get_password_hash(doctor.password),
        qualification=doctor.qualification
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

def authenticate_doctor(db: Session, email: str, password: str):
    """Authenticate doctor with email and password"""
    logger = logging.getLogger(__name__)
    logger.debug("Authenticating doctor with email=%s", email)
    doctor = get_doctor_by_email(db, email)
    if not doctor:
        logger.debug("Doctor not found: %s", email)
        return False

    # Handle case where password_hash might be None or empty
    if not doctor.password_hash:
        logger.debug("Doctor has no password_hash set: %s", email)
        return False

    if not verify_password(password, doctor.password_hash):
        logger.debug("Password verification failed for doctor: %s", email)
        return False
    return doctor
