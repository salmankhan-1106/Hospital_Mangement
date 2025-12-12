🏥 HealthLane – Hospital Management System

HealthLane is a modern, full-stack hospital management system designed to simplify patient management, doctor appointments, scheduling, and medical workflow.

This project includes a FastAPI backend, React.js frontend, and PostgreSQL database, making HealthLane fast, secure, and scalable.

🚀 Tech Stack (HealthLane)
Backend (HealthLane API)

FastAPI

Uvicorn

SQLAlchemy

PostgreSQL

Pydantic

bcrypt + passlib

python-jose (JWT)

pgcrypto (for doctor secret key hashing)

Frontend (HealthLane Web App)

React.js

Vite

Axios

React Router

Tailwind CSS

Lucide-React

📌 Features of HealthLane
👨‍⚕️ Doctor Features

Secure login with secret registration key

View & manage appointments

Update appointment status

Add diagnosis/results

Access patient visit history

Update personal doctor profile

👤 Patient Features

Register & login

Book an appointment with available doctors

View past & upcoming appointments

Cancel appointments

Edit patient profile

Clean dashboard with useful stats

🛠 System Features

JWT authentication

Password hashing (bcrypt)

Secure API communication

Modular component design

Protected routes

Fully responsive UI

📂 HealthLane Project Structure
Backend – healthlane-api
backend/
│── app/
│   ├── crud/
│   ├── routers/
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── utils.py
│   └── main.py
│
│── full_database.sql
│── setup_config.sql
│── requirements.txt

Frontend – healthlane-client
frontend/
│── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
│── vite.config.js
│── package.json

🗃 HealthLane Database Overview
Tables

patients

doctors

appointments

config (stores hashed secret key using pgcrypto)

Relationships

1 doctor → many appointments

1 patient → many appointments

Each appointment links a doctor + patient

🔐 HealthLane Authentication Flow

User logs in

Backend validates credentials

JWT token is generated

Frontend stores token

Axios adds token to all requests

Protected routes validate JWT

🧪 Core API Endpoints (HealthLane API)
Auth
POST /api/auth/login/patient
POST /api/auth/login/doctor
POST /api/auth/register/patient
POST /api/auth/register/doctor
GET  /api/auth/me

Appointments
POST   /api/appointments/
GET    /api/appointments/my
PUT    /api/appointments/{id}
DELETE /api/appointments/{id}

Doctors
GET /api/doctors
GET /api/doctors/me
PUT /api/doctors/me

Patients
GET /api/patients/me
PUT /api/patients/me

🧰 How to Run HealthLane Locally
Backend (HealthLane API)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend (HealthLane Client)
cd frontend
npm install
npm run dev

📷 Screenshots (Optional for HealthLane)

Create a folder:

/screenshots
   ├── healthlane-login.png
   ├── healthlane-dashboard.png
   └── healthlane-appointments.png

🎯 Future Enhancements for HealthLane

Admin portal

Doctor availability scheduling

Automatic email reminders

Patient medical history records

PDF report generation

📝 License (Optional)

Let me know if you want:

MIT

All Rights Reserved

Custom restrictive license

Private repository settings
