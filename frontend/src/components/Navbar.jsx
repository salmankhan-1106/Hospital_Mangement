import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ toggleSidebar, userType }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name || 'User');
      
      // Display correct role based on userType
      if (userType === 'patient') {
        setUserRole('Patient');
      } else if (userType === 'doctor') {
        setUserRole('Doctor');
      } else {
        setUserRole('Administrator');
      }
    }
  }, [userType]);

  const handleProfileClick = () => {
    if (userType === 'patient') {
      navigate('/patient/profile');
    } else if (userType === 'doctor') {
      navigate('/doctor/profile');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search patients, appointments..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        <div className="notification-container">
          <button 
            className="icon-btn notification-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="badge pulse">3</span>
          </button>
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <button className="mark-read-btn">Mark all as read</button>
              </div>
              <div className="notification-list">
                <div className="notification-item unread">
                  <div className="notification-icon">
                    <Bell size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">Appointment Confirmed</p>
                    <p className="notification-text">Your appointment with Dr. Smith is confirmed</p>
                    <span className="notification-time">5 min ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">
                    <Bell size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">Test Results Ready</p>
                    <p className="notification-text">Your lab results are now available</p>
                    <span className="notification-time">2 hours ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">
                    <Bell size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">Reminder</p>
                    <p className="notification-text">Appointment tomorrow at 10:00 AM</p>
                    <span className="notification-time">1 day ago</span>
                  </div>
                </div>
              </div>
              <div className="notification-footer">
                <button className="view-all-btn">View All Notifications</button>
              </div>
            </div>
          )}
        </div>
        <div className="user-menu user-menu-interactive" onClick={handleProfileClick}>
          <div className="user-avatar user-avatar-animated">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
