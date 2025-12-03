import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState('Dr. Admin');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name || 'Dr. Admin');
    }
  }, []);

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
        <button className="icon-btn notification-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        
        <div className="user-menu">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
