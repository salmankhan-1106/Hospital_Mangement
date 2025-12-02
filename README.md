# Hospital Management System

A full-stack hospital management application built with React and FastAPI.

## Features

- **Patient Management**: Register and manage patient records
- **Doctor Portal**: Separate authentication for doctors with admin secret key
- **Appointments**: Schedule and track appointments with unique appointment codes
- **Dashboard**: Real-time statistics and overview
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing

## Tech Stack

### Frontend
- React 19.2.0
- Vite 7.2.4
- React Router
- Axios
- Lucide React Icons

### Backend
- FastAPI 0.123.0
- SQLAlchemy 2.0.44
- PostgreSQL
- Python Jose (JWT)
- Bcrypt

## Database Schema

The application uses a simplified UUID-based schema with 3 main tables:
- **patients**: Patient information and credentials
- **doctors**: Doctor information and credentials
- **appointments**: Appointment management with status tracking

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- PostgreSQL

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend/app
```

2. Install dependencies:
```bash
pip install -r ../requirements.txt
```

3. Configure database in `database.py`:
- Database: projectdb
- Username: postgres
- Password: 123
- Host: localhost:5432

4. Run the backend:
```bash
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

### Patient Registration
- Click "Patient Login" on landing page
- Click "Create Account"
- Fill in: Name, Contact Number, Password
- Login with contact number and password

### Doctor Registration
- Click "Admin Login" on landing page
- Click "Create Account"
- Fill in: Name, Email, Password, Qualification (optional)
- **Admin Secret Key**: `123$`
- After registration, login with email and password

### Features
- Patients can book appointments with doctors
- Doctors can view and manage appointments
- Track appointments using unique appointment codes
- Real-time dashboard statistics

## Project Structure

```
Hospital Managment/
├── backend/
│   ├── app/
│   │   ├── crud/           # Database CRUD operations
│   │   ├── routers/        # API endpoints
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── database.py     # Database configuration
│   │   ├── utils.py        # Utility functions (JWT, hashing)
│   │   └── main.py         # FastAPI application
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register/patient` - Register new patient
- `POST /api/auth/register/doctor` - Register new doctor
- `POST /api/auth/login/patient` - Patient login
- `POST /api/auth/login/doctor` - Doctor login

### Appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/my` - Get user's appointments
- `GET /api/appointments/code/{code}` - Get appointment by code
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

### Patients & Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/patients/me` - Get current patient profile
- `GET /api/doctors/me` - Get current doctor profile

## Security

- Passwords hashed using bcrypt
- JWT token-based authentication
- Admin secret key validation on frontend
- CORS enabled for development
- Auto-logout on token expiration

## Contributors

- Salman Khan - [@salmankhan-1106](https://github.com/salmankhan-1106)

## License

This project is for educational purposes.
