# Patient Portal - Implementation Guide

## What's Already Done (Admin Side)

### Backend APIs Ready ✅
All these endpoints are working and tested:

**Authentication:**
- `POST /api/auth/register/patient` - Patient registration
- `POST /api/auth/login/patient` - Patient login

**Appointments:**
- `POST /api/appointments/` - Create appointment (requires auth token)
- `GET /api/appointments/my` - Get patient's appointments
- `GET /api/appointments/code/{code}` - Check appointment by code (no auth needed)

**Doctors:**
- `GET /api/doctors` - List all available doctors

**Patient Profile:**
- `GET /api/patients/me` - Get current patient profile

### Database Schema ✅
```sql
patients (id, name, contact, password_hash, created_at)
doctors (id, name, email, qualification, created_at)
appointments (id, appointment_code, patient_id, doctor_id, problem, result, status, created_at, updated_at)
```

## What Needs to Be Built (Patient Portal)

### 1. Patient Dashboard
**Route:** `/patient/dashboard`

**Features:**
- Welcome message with patient name
- Quick stats:
  - Total appointments
  - Pending appointments
  - Completed appointments
- Recent appointments list
- Quick actions: Book appointment, Check report

**API Calls:**
- `GET /api/appointments/my` - Fetch patient's appointments
- `GET /api/patients/me` - Get patient info

---

### 2. Book Appointment Page
**Route:** `/patient/book-appointment`

**Features:**
- List of all doctors with:
  - Name
  - Email
  - Qualification
- Select doctor
- Enter problem/symptoms (textarea)
- Submit button

**API Calls:**
- `GET /api/doctors` - List doctors
- `POST /api/appointments/` - Create appointment
  ```json
  {
    "doctor_id": "uuid-here",
    "problem": "Patient's complaint description"
  }
  ```

**Response:**
- Show success message with appointment code
- Display: "Your appointment code is: APT-abc12345"
- Tell patient to save this code

---

### 3. My Appointments Page
**Route:** `/patient/appointments`

**Features:**
- Table showing all appointments:
  - Appointment Code
  - Doctor Name
  - Problem
  - Status (pending/completed/cancelled)
  - Date
  - Actions (View Report button if completed)

**API Calls:**
- `GET /api/appointments/my` - Fetch appointments

**For each completed appointment:**
- Show "View Report" button
- Opens medical report viewer (component already created)

---

### 4. Check Report by Code
**Route:** `/patient/check-report` or `/report/{code}`

**Features:**
- Input field for appointment code
- Submit button
- If valid code:
  - Show MedicalReport component with full details
  - PDF download option

**API Calls:**
- `GET /api/appointments/code/{appointment_code}` - No auth needed!

**Usage:**
```jsx
import MedicalReport from '../components/MedicalReport';

// After fetching appointment data
<MedicalReport 
  appointment={appointmentData}
  patient={patientData}
  doctor={doctorData}
/>
```

---

### 5. Patient Profile Page
**Route:** `/patient/profile`

**Features:**
- Display patient information:
  - Name
  - Contact
  - Registration date
- Edit profile option (optional)

**API Calls:**
- `GET /api/patients/me`

---

## Authentication Flow (Already Working)

### Registration (Login.jsx already handles this):
```javascript
const registerData = {
  name: formData.name,
  contact: formData.contact,
  password: formData.password
};

const response = await axios.post(
  'http://localhost:8000/api/auth/register/patient',
  registerData
);

// Store token and user
localStorage.setItem('token', response.data.access_token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### Login (Login.jsx already handles this):
```javascript
const loginData = {
  contact: formData.contact,
  password: formData.password
};

const response = await axios.post(
  'http://localhost:8000/api/auth/login/patient',
  loginData
);
```

### Making Authenticated Requests:
```javascript
const token = localStorage.getItem('token');

const response = await axios.get(
  'http://localhost:8000/api/appointments/my',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

---

## Components Already Available

### 1. MedicalReport Component ✅
**Location:** `frontend/src/components/MedicalReport.jsx`

**Usage:**
```jsx
import MedicalReport from '../components/MedicalReport';

<MedicalReport 
  appointment={{
    appointment_code: "APT-abc123",
    problem: "Fever and headache",
    result: JSON.stringify({
      diagnosis: "Viral fever",
      prescription: "Paracetamol 500mg",
      advice: "Rest and drink fluids",
      followUp: "After 3 days if symptoms persist"
    }),
    status: "completed",
    created_at: "2024-12-01T10:00:00Z"
  }}
  patient={{
    name: "Patient Name",
    contact: "+92-300-1234567"
  }}
  doctor={{
    name: "Dr. Smith",
    email: "doctor@hospital.com",
    qualification: "MBBS, MD"
  }}
/>
```

### 2. Reusable Components ✅
- `Card.jsx` - Card wrapper
- `Table.jsx` - Data tables
- `Navbar.jsx` - Top navigation
- `Sidebar.jsx` - Side navigation (modify for patient menu)

---

## Recommended Patient Routes Structure

```jsx
// In App.jsx, add these routes:

<Route path="/patient/dashboard" element={
  <ProtectedRoute>
    <PatientLayout>
      <PatientDashboard />
    </PatientLayout>
  </ProtectedRoute>
} />

<Route path="/patient/book-appointment" element={
  <ProtectedRoute>
    <PatientLayout>
      <BookAppointment />
    </PatientLayout>
  </ProtectedRoute>
} />

<Route path="/patient/appointments" element={
  <ProtectedRoute>
    <PatientLayout>
      <MyAppointments />
    </PatientLayout>
  </ProtectedRoute>
} />

<Route path="/patient/profile" element={
  <ProtectedRoute>
    <PatientLayout>
      <PatientProfile />
    </PatientLayout>
  </ProtectedRoute>
} />

<Route path="/report/:code" element={
  <CheckReport />
} />
```

---

## Patient Sidebar Menu

Create similar to admin sidebar with these items:
- Dashboard
- Book Appointment
- My Appointments
- Profile
- Logout

---

## Testing the APIs

### Backend is running on:
`http://localhost:8000`

### Test with Postman or curl:

**1. Register Patient:**
```bash
POST http://localhost:8000/api/auth/register/patient
Content-Type: application/json

{
  "name": "Test Patient",
  "contact": "0300-1234567",
  "password": "password123"
}
```

**2. Login Patient:**
```bash
POST http://localhost:8000/api/auth/login/patient
Content-Type: application/json

{
  "contact": "0300-1234567",
  "password": "password123"
}
```

**3. Get Doctors:**
```bash
GET http://localhost:8000/api/doctors
```

**4. Create Appointment:**
```bash
POST http://localhost:8000/api/appointments/
Authorization: Bearer {token}
Content-Type: application/json

{
  "doctor_id": "doctor-uuid-here",
  "problem": "I have fever and headache"
}
```

**5. Get My Appointments:**
```bash
GET http://localhost:8000/api/appointments/my
Authorization: Bearer {token}
```

**6. Check Report by Code:**
```bash
GET http://localhost:8000/api/appointments/code/APT-abc12345
```

---

## Important Notes

1. **Backend is already running** - Just use the APIs
2. **Medical report component is ready** - Just import and use it
3. **Authentication is working** - Login.jsx handles patient registration/login
4. **All CRUD operations are tested** - Endpoints are working

## Questions or Issues?

- Backend documentation: Check `README.md`
- API testing: Use `/docs` endpoint: `http://localhost:8000/docs`
- MedicalReport styling: `frontend/src/components/MedicalReport.css`

---

## What's Next?

Your partner should focus on:
1. Creating patient layout with sidebar
2. Building the 4-5 patient pages listed above
3. Integrating with existing backend APIs
4. Using the MedicalReport component for displaying results

Everything on the backend is ready and tested! 🚀
