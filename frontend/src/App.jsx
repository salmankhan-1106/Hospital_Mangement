import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Admin dashboard
import Patients from './pages/Patients';
import Appointments from './pages/Appointments'; // Admin appointments
import Doctors from './pages/Doctors';
import DoctorPatients from './pages/DoctorPatients'; // New
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PatientDashboard from './pages/Patient_Dashboard'; // New
import MyAppointments from './pages/MyAppointments'; // New
import BookAppointment from './pages/BookAppointment'; // New
import Profile from './pages/Profile'; // New
import DoctorProfile from './pages/DoctorProfile'; // New

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'patient' or 'doctor'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setIsAuthenticated(true);
      setUserType(user.type);
    }
  }, []);

  const ProtectedRoute = ({ children, allowedType }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (allowedType && userType !== allowedType) {
      return <Navigate to={userType === 'patient' ? '/patient/dashboard' : '/dashboard'} replace />;
    }
    return children;
  };

  const MainLayout = ({ children }) => (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userType={userType} /> {/* Pass userType */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userType={userType} /> {/* Pass userType */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />} />
        
        {/* Admin (Doctor) Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedType="doctor">
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedType="doctor">
              <MainLayout>
                <DoctorPatients />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedType="doctor">
              <MainLayout>
                <Appointments />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute allowedType="doctor">
              <MainLayout>
                <Doctors />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedType="doctor">
              <MainLayout>
                <DoctorProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedType="patient">
              <MainLayout>
                <PatientDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedType="patient">
              <MainLayout>
                <MyAppointments />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book"
          element={
            <ProtectedRoute allowedType="patient">
              <MainLayout>
                <BookAppointment />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedType="patient">
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;