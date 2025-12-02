import React from 'react';
import { Plus, Phone, Mail, Briefcase } from 'lucide-react';
import Card from '../components/Card';
import './Doctors.css';

const Doctors = () => {
  const doctors = [];

  return (
    <div className="doctors-page">
      <div className="page-header">
        <div>
          <h1>Doctors</h1>
          <p className="page-subtitle">View and manage medical staff</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Add New Doctor
        </button>
      </div>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="doctor-card">
            <div className="doctor-avatar">
              <div className="avatar-placeholder">
                {doctor.name.split(' ')[1][0]}
              </div>
            </div>
            <div className="doctor-info">
              <h3 className="doctor-name">{doctor.name}</h3>
              <p className="doctor-specialty">{doctor.specialty}</p>
              
              <div className="doctor-details">
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{doctor.phone}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{doctor.email}</span>
                </div>
                <div className="detail-item">
                  <Briefcase size={16} />
                  <span>{doctor.experience}</span>
                </div>
              </div>

              <div className="doctor-stats">
                <div className="stat">
                  <div className="stat-value">{doctor.patients}</div>
                  <div className="stat-label">Patients</div>
                </div>
                <div className="stat">
                  <div className="stat-value">4.8</div>
                  <div className="stat-label">Rating</div>
                </div>
              </div>

              <div className="doctor-actions">
                <button className="btn-secondary">View Profile</button>
                <button className="btn-primary">Book Appointment</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
