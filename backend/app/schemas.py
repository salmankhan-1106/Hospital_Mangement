from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Patient Schemas
class PatientCreate(BaseModel):
    name: str
    contact: str  # phone or contact info
    password: str

class PatientLogin(BaseModel):
    contact: str
    password: str

class PatientResponse(BaseModel):
    id: UUID
    name: str
    contact: str
    created_at: datetime
    
    class Config:
        orm_mode = True

# Doctor Schemas
class DoctorCreate(BaseModel):
    secret_key: str = Field(..., description="Admin secret key (123$)")
    name: str
    email: EmailStr
    password: str
    qualification: Optional[str] = None

class DoctorLogin(BaseModel):
    email: EmailStr
    password: str

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    department: Optional[str] = None
    experience: Optional[str] = None
    bio: Optional[str] = None

class DoctorResponse(BaseModel):
    id: UUID
    name: str
    email: str
    phone: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    department: Optional[str] = None
    experience: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

# Appointment Schemas
class AppointmentCreate(BaseModel):
    doctor_id: UUID
    problem: str
    severity: Optional[str] = None  # mild, moderate, severe
    duration: Optional[str] = None  # e.g., "2 days", "1 week"
    medical_history: Optional[str] = None  # patient's previous diseases/conditions

class AppointmentUpdate(BaseModel):
    result: Optional[str] = None
    status: Optional[str] = None  # pending, completed, cancelled

class AppointmentResponse(BaseModel):
    id: UUID
    appointment_code: str
    patient_id: UUID
    doctor_id: Optional[UUID]
    problem: str
    severity: Optional[str] = None
    duration: Optional[str] = None
    medical_history: Optional[str] = None
    result: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
    patient: Optional['PatientResponse'] = None
    doctor: Optional['DoctorResponse'] = None
    
    class Config:
        orm_mode = True

# Appointment code lookup schema
class AppointmentCodeLookup(BaseModel):
    appointment_code: str
