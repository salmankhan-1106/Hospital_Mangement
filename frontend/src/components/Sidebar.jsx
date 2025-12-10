import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  BookOpen,
  User
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen, userType }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const doctorMenu = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/doctors', icon: UserCircle, label: 'Profile' },
  ];

  const patientMenu = [
    { path: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patient/appointments', icon: Calendar, label: 'My Appointments' },
    { path: '/patient/book', icon: BookOpen, label: 'Book Appointment' },
    { path: '/patient/profile', icon: User, label: 'Profile' },
  ];

  const menuItems = userType === 'patient' ? patientMenu : doctorMenu;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Ensure auth state resets
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Activity size={32} className="logo-icon" />
            {isOpen && <span className="logo-text">HealthCare</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={22} className="nav-icon" />
              {isOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={22} className="nav-icon" />
            {isOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>

        <button 
          className="sidebar-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;