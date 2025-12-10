import React, { useState, useEffect } from 'react';
import { Search, Users, Phone, Calendar } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import Table from '../components/Table';
import './Patients.css';

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Get doctor's appointments to extract unique patients
        const appointmentsRes = await api.get('/api/appointments/my');
        const appointments = appointmentsRes.data || [];
        
        // Extract unique patients from appointments
        const uniquePatients = [];
        const patientMap = new Map();
        
        appointments.forEach(appt => {
          if (appt.patient && !patientMap.has(appt.patient.id)) {
            patientMap.set(appt.patient.id, {
              ...appt.patient,
              lastVisit: new Date(appt.created_at).toLocaleDateString(),
              appointmentCount: 1
            });
            uniquePatients.push(patientMap.get(appt.patient.id));
          } else if (appt.patient && patientMap.has(appt.patient.id)) {
            patientMap.get(appt.patient.id).appointmentCount += 1;
          }
        });
        
        setPatients(uniquePatients);
      } catch (err) {
        console.error('Failed to load patients:', err);
        setError('Failed to load patient list');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact?.includes(searchTerm)
  );

  const columns = [
    { header: 'Patient Name', key: 'name', width: '25%' },
    { 
      header: 'Contact', 
      key: 'contact', 
      width: '20%',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Phone size={14} style={{ color: '#3b82f6' }} />
          {row.contact}
        </div>
      )
    },
    { 
      header: 'Appointments', 
      key: 'appointmentCount', 
      width: '15%',
      render: (row) => (
        <span style={{ background: '#dbeafe', color: '#3b82f6', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: '600' }}>
          {row.appointmentCount || 0}
        </span>
      )
    },
    { 
      header: 'Last Visit', 
      key: 'lastVisit', 
      width: '20%',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={14} style={{ color: '#3b82f6' }} />
          {row.lastVisit || 'N/A'}
        </div>
      )
    }
  ];

  return (
    <div className="patients-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>My Patients</h1>
          <p style={{ color: '#6b7280' }}>View patients who have appointments with you</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: '#dbeafe', borderRadius: '10px', color: '#3b82f6', fontWeight: '600' }}>
          <Users size={20} />
          Total: {patients.length}
        </div>
      </div>

      <Card className="patients-card" style={{ padding: '1.5rem' }}>
        {error && <div style={{ color: '#dc2626', marginBottom: '15px', padding: '1rem', background: '#fee2e2', borderRadius: '5px' }}>{error}</div>}
        {loading && <p style={{ color: '#6b7280' }}>Loading patients...</p>}
        
        {!loading && (
          <>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px', background: '#f3f4f6', borderRadius: '8px', padding: '0 0.75rem', border: '1px solid #e5e7eb' }}>
                <Search size={18} style={{ color: '#6b7280' }} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    outline: 'none', 
                    padding: '0.75rem', 
                    width: '100%',
                    color: '#1f2937',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <Table columns={columns} data={filteredPatients} />

            {filteredPatients.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <Users size={40} style={{ margin: '0 auto 1rem', opacity: '0.5' }} />
                <p>No patients found</p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default DoctorPatients;
