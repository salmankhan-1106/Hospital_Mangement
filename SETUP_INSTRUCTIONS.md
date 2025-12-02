# Hospital Management System - Setup Instructions

## Database Setup

### Step 1: Run DDL Script in pgAdmin 4
1. Open pgAdmin 4
2. Connect to your PostgreSQL server
3. Right-click on database `projectdb` → Query Tool
4. Open the file: `backend/database_schema.sql`
5. Click Execute (F5) to run the entire script
6. Verify tables were created by checking the Tables section

### Step 2: Verify Database Tables Created
After running the script, you should see these tables:
- config
- departments  
- users
- doctors
- patients
- appointments
- medical_reports
- doctor_reviews
- prescriptions
- lab_tests
- audit_logs

## Backend Setup

### Step 3: Start the Backend Server
```powershell
cd "backend"
python -m uvicorn app.main:app --reload
```

The backend API will start at: http://localhost:8000

### Step 4: Test API Endpoints
Visit http://localhost:8000/docs to see the interactive API documentation (Swagger UI)

## Frontend Setup

### Step 5: Start the Frontend Development Server
```powershell
cd "frontend"
npm run dev
```

The frontend will start at: http://localhost:5173

## Testing the Login System

### Create First Admin/Doctor Account
1. Open http://localhost:5173
2. Click "Admin Login"
3. You'll need to register first - use the API:

**Option A: Using Swagger UI (http://localhost:8000/docs)**
1. Find POST /api/auth/register/doctor
2. Click "Try it out"
3. Enter this JSON:
```json
{
  "secret_key": "123$",
  "username": "dr_smith",
  "email": "dr.smith@hospital.com",
  "password": "password123",
  "full_name": "Dr. John Smith",
  "phone": "+92-300-1234567",
  "specialization": "Cardiology",
  "qualification": "MBBS, MD Cardiology",
  "department_id": 1
}
```
4. Click Execute

**Option B: Using curl/PowerShell**
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/auth/register/doctor" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "secret_key": "123$",
    "username": "dr_smith",
    "email": "dr.smith@hospital.com",
    "password": "password123",
    "full_name": "Dr. John Smith",
    "phone": "+92-300-1234567",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD Cardiology",
    "department_id": 1
  }'
```

### Login as Admin
1. Go to http://localhost:5173
2. Click "Admin Login"
3. Enter:
   - Email: dr.smith@hospital.com
   - Password: password123
4. Click "Sign In"

### Create a Patient Account
Use the API to register a patient:
```json
{
  "username": "patient_john",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+92-300-9876543",
  "date_of_birth": "1990-05-15",
  "gender": "Male",
  "blood_group": "O+"
}
```

Then login with:
- Email: john@example.com
- Password: password123

## Important Notes

1. **Admin Secret Key**: The secret key to create doctors/admins is `123$`
2. **Database Connection**: Make sure PostgreSQL is running on localhost:5432
3. **Database Credentials**: 
   - Database: projectdb
   - Username: postgres
   - Password: 123

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials in `backend/app/database.py`
- Make sure all Python packages are installed: `pip install -r requirements.txt`

### Login fails
- Check if DDL script was executed successfully in PostgreSQL
- Verify user was created in the database
- Check browser console for errors
- Verify backend is running at http://localhost:8000

### CORS errors
- Backend CORS is configured for `http://localhost:5173`
- If using different port, update `backend/app/main.py`
