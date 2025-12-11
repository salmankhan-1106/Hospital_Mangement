import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Eye, XCircle, Filter } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import api from '../api';
import './Appointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const res = await api.get('/api/appointments/my');
        setAppointments(res.data.map(appt => ({
          id: appt.id,
          appointmentCode: appt.appointment_code || 'N/A',
          doctor: appt.doctor?.name || 'Unassigned',
          date: new Date(appt.created_at).toLocaleDateString(),
          time: new Date(appt.created_at).toLocaleTimeString(),
          problem: appt.problem,
          status: appt.status
        })));
      } catch (err) {
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const columns = [
    { header: 'Appointment Code', key: 'appointmentCode' },
    { header: 'Doctor', key: 'doctor' },
    { header: 'Date', key: 'date' },
    { header: 'Time', key: 'time' },
    { header: 'Problem', key: 'problem' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="action-buttons">
          <button 
            className="btn-action btn-view" 
            title="View Details"
            onClick={() => handleViewDetails(row)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s',
              boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(59, 130, 246, 0.3)';
            }}
          >
            <Eye size={16} />
            View Details
          </button>
          {row.status === 'pending' && (
            <button className="btn-action btn-cancel" onClick={() => handleCancel(row.id)} title="Cancel Appointment">
              <XCircle size={16} />
              Cancel
            </button>
          )}
        </div>
      )
    }
  ];

  const handleCancel = async (id) => {
    try {
      await api.delete(`/api/appointments/${id}`);
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to cancel');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };


  const filteredAppointments = filterStatus === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filterStatus);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#1e40af', fontSize: '1.2rem' }}>Loading...</p>
    </div>
  );
  if (error) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#1e40af', fontSize: '1.2rem' }}>{error}</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)',
      padding: '2rem'
    }}>
      <div className="appointments-page">
        <div className="page-header" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
          padding: '2rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              My Appointments
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#3b82f6',
              fontWeight: '500'
            }}>
              View and manage your scheduled appointments
            </p>
          </div>
        </div>

        <div className="filter-section" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.08)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="filter-group">
            <Filter size={18} style={{ color: '#3b82f6' }} />
            <span style={{ color: '#1e293b', fontWeight: '600' }}>Filter by Status:</span>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
                style={{
                  background: filterStatus === 'all' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(59, 130, 246, 0.1)',
                  color: filterStatus === 'all' ? 'white' : '#3b82f6',
                  border: 'none',
                  boxShadow: filterStatus === 'all' ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none'
                }}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
                style={{
                  background: filterStatus === 'pending' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(59, 130, 246, 0.1)',
                  color: filterStatus === 'pending' ? 'white' : '#3b82f6',
                  border: 'none',
                  boxShadow: filterStatus === 'pending' ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none'
                }}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
                style={{
                  background: filterStatus === 'completed' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(59, 130, 246, 0.1)',
                  color: filterStatus === 'completed' ? 'white' : '#3b82f6',
                  border: 'none',
                  boxShadow: filterStatus === 'completed' ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none'
                }}
              >
                Completed
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
                onClick={() => setFilterStatus('cancelled')}
                style={{
                  background: filterStatus === 'cancelled' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(59, 130, 246, 0.1)',
                  color: filterStatus === 'cancelled' ? 'white' : '#3b82f6',
                  border: 'none',
                  boxShadow: filterStatus === 'cancelled' ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none'
                }}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        <Card className="appointments-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.08)',
          backdropFilter: 'blur(10px)'
        }}>
          <Table columns={columns} data={filteredAppointments} />
          {filteredAppointments.length === 0 && (
            <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
              <Calendar size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <p style={{ color: '#3b82f6', fontSize: '1.1rem', fontWeight: '500' }}>No appointments found</p>
            </div>
          )}
        </Card>

        {/* Appointment Details Modal */}
        {showModal && selectedAppointment && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              animation: 'fadeIn 0.3s ease'
            }}
            onClick={closeModal}
          >
            <div 
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                borderRadius: '24px',
                padding: '2.5rem',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                animation: 'slideUp 0.3s ease',
                border: '2px solid rgba(59, 130, 246, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                ×
              </button>

              <h2 style={{
                margin: '0 0 2rem 0',
                fontSize: '2rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}>
                Appointment Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(109, 40, 217, 0.08) 100%)',
                  borderRadius: '16px',
                  border: '2px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <div style={{ color: '#8b5cf6', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Appointment Code</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', fontFamily: 'monospace', letterSpacing: '1px' }}>{selectedAppointment.appointmentCode || 'N/A'}</div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                  borderRadius: '16px',
                  border: '2px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <div style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Doctor</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{selectedAppointment.doctor}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{
                    padding: '1.25rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Date</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{selectedAppointment.date}</div>
                  </div>
                  <div style={{
                    padding: '1.25rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Time</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{selectedAppointment.time}</div>
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0'
                }}>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Problem Description</div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: '#475569', lineHeight: '1.6' }}>{selectedAppointment.problem}</div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: selectedAppointment.status === 'completed' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)' :
                            selectedAppointment.status === 'pending' ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)' :
                            'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  borderRadius: '12px',
                  border: '2px solid ' + (selectedAppointment.status === 'completed' ? '#10b981' :
                          selectedAppointment.status === 'pending' ? '#f59e0b' : '#ef4444'),
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Status</div>
                  <div style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '800', 
                    color: selectedAppointment.status === 'completed' ? '#10b981' :
                           selectedAppointment.status === 'pending' ? '#f59e0b' : '#ef4444',
                    textTransform: 'capitalize'
                  }}>
                    {selectedAppointment.status === 'pending' ? '⏳ ' : selectedAppointment.status === 'completed' ? '✅ ' : '❌ '}
                    {selectedAppointment.status}
                  </div>
                  {selectedAppointment.status === 'pending' && (
                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>
                      Your appointment is being processed by the doctor
                    </div>
                  )}
                  {selectedAppointment.status === 'completed' && (
                    <div style={{ color: '#059669', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '600' }}>
                      Your appointment has been completed successfully!
                    </div>
                  )}
                </div>

                {selectedAppointment.status === 'completed' && (
                  <div style={{ color: '#059669', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '600' }}>
                    Your appointment has been completed successfully!
                  </div>
                )}
              </div>
            </div>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { 
                  opacity: 0;
                  transform: translateY(30px);
                }
                to { 
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;