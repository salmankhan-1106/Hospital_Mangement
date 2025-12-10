import React, { useState, useEffect } from 'react';
import { Plus, Phone, Mail, Briefcase, Star } from 'lucide-react';
import Card from '../components/Card';
import './Doctors.css';
import api from '../api'; // Use api index re-export
import DoctorProfile from './DoctorProfile'; // Import the DoctorProfile component

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Determine current user type from localStorage
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  const isPatient = currentUser?.type === 'patient';

  useEffect(() => {
    if (isPatient) {
      const fetchDoctors = async () => {
        try {
          const res = await api.get('/api/doctors');
          setDoctors(res.data || []);
        } catch (err) {
          console.error('Failed to load doctors:', err);
          setError('Failed to load doctors list');
        } finally {
          setLoading(false);
        }
      };
      fetchDoctors();
    } else {
      // For doctors, no need to fetch list; just set loading false as profile will handle its own fetch
      setLoading(false);
    }
  }, [isPatient]);

  // If doctor, render their own profile using DoctorProfile component
  if (!isPatient) {
    return <DoctorProfile />;
  }

  // For patients, render the list as before
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', margin: 0, marginBottom: '0.5rem' }}>Doctors</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Browse and book appointments with our medical staff</p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          Loading doctors...
        </div>
      )}

      {!loading && doctors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          No doctors available at the moment.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {doctors.map((doctor) => (
          <Card 
            key={doctor.id}
            style={{ 
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid var(--border-color)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--primary-color)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}
              >
                {doctor.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Doctor Info */}
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem 0', textAlign: 'center', fontSize: '1.1rem', fontWeight: '600' }}>
              Dr. {doctor.name}
            </h3>
            <p style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500' }}>
              {doctor.specialization || doctor.qualification || 'General Practitioner'}
            </p>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {doctor.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <Phone size={16} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                  <span>{doctor.phone}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Mail size={16} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                <span>{doctor.email}</span>
              </div>
              {doctor.experience && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <Briefcase size={16} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                  <span>{doctor.experience}</span>
                </div>
              )}
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
              ))}
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '0.25rem' }}>4.8</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--primary-color)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--primary-color)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'var(--bg-secondary)';
                  e.target.style.color = 'var(--text-primary)';
                  e.target.style.borderColor = 'var(--border-color)';
                }}
              >
                View Profile
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#1e40af';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'var(--primary-color)';
                }}
                onClick={() => window.location.href = `/patient/book?doctorId=${doctor.id}`}
              >
                Book Now
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;