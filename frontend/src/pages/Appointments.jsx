import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import api from '../api';
import './Appointments.css';

const Appointments = () => {
  const userType = localStorage.getItem('userType') || JSON.parse(localStorage.getItem('user') || '{}').type;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editResult, setEditResult] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [appointmentToReject, setAppointmentToReject] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const endpoint = userType === 'doctor' ? '/api/appointments/my' : '/api/appointments/my';
        const response = await api.get(endpoint);
        const data = response.data || [];
        
        setAppointments(data.map(appt => ({
          id: appt.id,
          patient: appt.patient?.name || 'Unknown Patient',
          doctor: appt.doctor?.name || 'Unassigned',
          date: new Date(appt.created_at).toLocaleDateString(),
          time: new Date(appt.created_at).toLocaleTimeString(),
          type: appt.problem || 'General',
          status: appt.status || 'pending',
          problem: appt.problem,
          severity: appt.severity || 'moderate',
          duration: appt.duration || '',
          medical_history: appt.medical_history || '',
          result: appt.result,
          appointmentCode: appt.appointment_code
        })));
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userType]);

  // Filter appointments
  const filteredAppointments = appointments.filter(appt => {
    const statusMatch = filterStatus === 'all' || appt.status === filterStatus;
    const today = new Date();
    const apptDate = new Date(appt.date);
    let dateMatch = true;
    
    if (filterDate === 'today') {
      dateMatch = apptDate.toDateString() === today.toDateString();
    } else if (filterDate === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateMatch = apptDate >= weekAgo && apptDate <= today;
    } else if (filterDate === 'month') {
      dateMatch = apptDate.getMonth() === today.getMonth() && apptDate.getFullYear() === today.getFullYear();
    }
    return statusMatch && dateMatch;
  });

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await api.put(`/api/appointments/${appointmentId}`, { status: newStatus, result: editResult });
      // Refresh appointments
      const endpoint = userType === 'doctor' ? '/api/appointments/my' : '/api/appointments/my';
      const response = await api.get(endpoint);
      const data = response.data || [];
      setAppointments(data.map(appt => ({
        id: appt.id,
        patient: appt.patient?.name || 'Unknown Patient',
        doctor: appt.doctor?.name || 'Unassigned',
        date: new Date(appt.created_at).toLocaleDateString(),
        time: new Date(appt.created_at).toLocaleTimeString(),
        type: appt.problem || 'General',
        status: appt.status || 'pending',
        problem: appt.problem,
        severity: appt.severity || 'moderate',
        duration: appt.duration || '',
        medical_history: appt.medical_history || '',
        result: appt.result,
        appointmentCode: appt.appointment_code,
        cancellation_reason: appt.cancellation_reason
      })));
      setShowModal(false);
      setEditResult('');
    } catch (err) {
      console.error('Failed to update appointment:', err);
      alert('Failed to update appointment');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle open modal
  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setEditResult(appointment.result || '');
    setShowModal(true);
  };

  // Handle confirm appointment
  const handleConfirmAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to confirm this appointment?')) return;
    
    setUpdatingId(appointmentId);
    try {
      await api.post('/api/appointments/confirm', { appointment_id: appointmentId });
      // Refresh appointments
      const response = await api.get('/api/appointments/my');
      const data = response.data || [];
      setAppointments(data.map(appt => ({
        id: appt.id,
        patient: appt.patient?.name || 'Unknown Patient',
        doctor: appt.doctor?.name || 'Unassigned',
        date: new Date(appt.created_at).toLocaleDateString(),
        time: new Date(appt.created_at).toLocaleTimeString(),
        type: appt.problem || 'General',
        status: appt.status || 'pending',
        problem: appt.problem,
        severity: appt.severity || 'moderate',
        duration: appt.duration || '',
        medical_history: appt.medical_history || '',
        result: appt.result,
        appointmentCode: appt.appointment_code,
        cancellation_reason: appt.cancellation_reason
      })));
      alert('Appointment confirmed successfully!');
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
      alert('Failed to confirm appointment: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle reject appointment - open modal
  const openRejectModal = (appointment) => {
    setAppointmentToReject(appointment);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  // Handle submit rejection
  const handleRejectAppointment = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setUpdatingId(appointmentToReject.id);
    try {
      await api.post('/api/appointments/reject', {
        appointment_id: appointmentToReject.id,
        cancellation_reason: rejectionReason
      });
      // Refresh appointments
      const response = await api.get('/api/appointments/my');
      const data = response.data || [];
      setAppointments(data.map(appt => ({
        id: appt.id,
        patient: appt.patient?.name || 'Unknown Patient',
        doctor: appt.doctor?.name || 'Unassigned',
        date: new Date(appt.created_at).toLocaleDateString(),
        time: new Date(appt.created_at).toLocaleTimeString(),
        type: appt.problem || 'General',
        status: appt.status || 'pending',
        problem: appt.problem,
        severity: appt.severity || 'moderate',
        duration: appt.duration || '',
        medical_history: appt.medical_history || '',
        result: appt.result,
        appointmentCode: appt.appointment_code,
        cancellation_reason: appt.cancellation_reason
      })));
      setShowRejectModal(false);
      setRejectionReason('');
      setAppointmentToReject(null);
      alert('Appointment rejected successfully!');
    } catch (err) {
      console.error('Failed to reject appointment:', err);
      alert('Failed to reject appointment: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { header: 'Appointment Code', key: 'appointmentCode' },
    { header: 'Patient', key: 'patient' },
    { header: 'Doctor', key: 'doctor' },
    { header: 'Date', key: 'date' },
    { header: 'Time', key: 'time' },
    { header: 'Type', key: 'type' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className={`status-badge status-${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-action btn-view"
            onClick={() => openModal(row)}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
            }}
          >
            View
          </button>
          {row.status === 'pending' && userType === 'doctor' && (
            <>
              <button 
                className="btn-action btn-confirm"
                onClick={() => handleConfirmAppointment(row.id)}
                disabled={updatingId === row.id}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  background: updatingId === row.id ? '#ccc' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: updatingId === row.id ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (updatingId !== row.id) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                }}
              >
                {updatingId === row.id ? 'Processing...' : 'Confirm'}
              </button>
              <button 
                className="btn-action btn-reject"
                onClick={() => openRejectModal(row)}
                disabled={updatingId === row.id}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  background: updatingId === row.id ? '#ccc' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: updatingId === row.id ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (updatingId !== row.id) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                }}
              >
                Reject
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p className="page-subtitle">View and manage patient appointments</p>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      {loading && <p>Loading appointments...</p>}

      {!loading && (
        <>
          <div className="appointments-filters" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className={`filter-btn ${filterDate === 'today' ? 'active' : ''}`}
              onClick={() => setFilterDate('today')}
              style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: filterDate === 'today' ? 'var(--primary-color)' : 'transparent', color: filterDate === 'today' ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}
            >
              Today
            </button>
            <button 
              className={`filter-btn ${filterDate === 'week' ? 'active' : ''}`}
              onClick={() => setFilterDate('week')}
              style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: filterDate === 'week' ? 'var(--primary-color)' : 'transparent', color: filterDate === 'week' ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}
            >
              This Week
            </button>
            <button 
              className={`filter-btn ${filterDate === 'month' ? 'active' : ''}`}
              onClick={() => setFilterDate('month')}
              style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: filterDate === 'month' ? 'var(--primary-color)' : 'transparent', color: filterDate === 'month' ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}
            >
              This Month
            </button>
            <button 
              className={`filter-btn ${filterDate === 'all' ? 'active' : ''}`}
              onClick={() => setFilterDate('all')}
              style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: filterDate === 'all' ? 'var(--primary-color)' : 'transparent', color: filterDate === 'all' ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}
            >
              All
            </button>
            {userType === 'doctor' && (
              <>
                <button 
                  className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('pending')}
                  style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: filterStatus === 'pending' ? '#f59e0b' : 'transparent', color: filterStatus === 'pending' ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}
                >
                  Pending
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('confirmed')}
                  style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: filterStatus === 'confirmed' ? '#3b82f6' : 'transparent', color: filterStatus === 'confirmed' ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}
                >
                  Confirmed
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('completed')}
                  style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: filterStatus === 'completed' ? '#10b981' : 'transparent', color: filterStatus === 'completed' ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}
                >
                  Completed
                </button>
              </>
            )}
          </div>

          <Card className="appointments-card">
            <Table columns={columns} data={filteredAppointments} />
          </Card>

          {showModal && selectedAppointment && (
            <div 
              className="modal-overlay" 
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
                animation: 'fadeIn 0.3s ease-out'
              }}
              onClick={() => setShowModal(false)}
            >
              <Card 
                style={{ 
                  maxWidth: '900px', 
                  width: '90%',
                  maxHeight: '90vh', 
                  overflow: 'auto',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  animation: 'slideUp 0.3s ease-out'
                }} 
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '2rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '2px solid rgba(59, 130, 246, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}>
                      <Calendar size={24} style={{ color: 'white' }} />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>
                        Appointment Details
                      </h2>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                        Code: {selectedAppointment.appointmentCode || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)} 
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '1.5rem', 
                      color: '#ef4444',
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      fontWeight: '600'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ef4444';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Modal Content */}
                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  
                  {/* Appointment Code */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(109, 40, 217, 0.05) 100%)',
                    borderRadius: '16px',
                    border: '2px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <label style={{ 
                      fontWeight: '700', 
                      display: 'block', 
                      marginBottom: '0.75rem',
                      color: '#8b5cf6',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Appointment Code
                    </label>
                    <p style={{ 
                      margin: 0,
                      color: '#1e293b', 
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      fontFamily: 'monospace',
                      letterSpacing: '1px'
                    }}>
                      {selectedAppointment.appointmentCode || 'N/A'}
                    </p>
                  </div>

                  {/* Patient & Doctor Info */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1.5rem' 
                  }}>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <label style={{ 
                        fontWeight: '700', 
                        display: 'block', 
                        marginBottom: '0.75rem',
                        color: '#3b82f6',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Patient Name
                      </label>
                      <p style={{ 
                        margin: 0,
                        color: '#1e293b', 
                        fontSize: '1.125rem',
                        fontWeight: '700'
                      }}>
                        {selectedAppointment.patient}
                      </p>
                    </div>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <label style={{ 
                        fontWeight: '700', 
                        display: 'block', 
                        marginBottom: '0.75rem',
                        color: '#3b82f6',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Doctor
                      </label>
                      <p style={{ 
                        margin: 0,
                        color: '#1e293b', 
                        fontSize: '1.125rem',
                        fontWeight: '700'
                      }}>
                        {selectedAppointment.doctor}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1.5rem' 
                  }}>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <label style={{ 
                        fontWeight: '700', 
                        display: 'block', 
                        marginBottom: '0.75rem',
                        color: '#10b981',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Date
                      </label>
                      <p style={{ 
                        margin: 0,
                        color: '#1e293b', 
                        fontSize: '1.125rem',
                        fontWeight: '700'
                      }}>
                        {selectedAppointment.date}
                      </p>
                    </div>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <label style={{ 
                        fontWeight: '700', 
                        display: 'block', 
                        marginBottom: '0.75rem',
                        color: '#10b981',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Time
                      </label>
                      <p style={{ 
                        margin: 0,
                        color: '#1e293b', 
                        fontSize: '1.125rem',
                        fontWeight: '700'
                      }}>
                        {selectedAppointment.time}
                      </p>
                    </div>
                  </div>

                  {/* Problem/Reason & Status in one row */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr', 
                    gap: '1.5rem' 
                  }}>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(245, 158, 11, 0.1)'
                    }}>
                      <label style={{ 
                        fontWeight: '700', 
                        display: 'block', 
                        marginBottom: '0.75rem',
                        color: '#f59e0b',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Problem/Reason
                      </label>
                      <p style={{ 
                        margin: 0,
                        color: '#1e293b', 
                        fontSize: '1rem',
                        lineHeight: '1.6'
                      }}>
                        {selectedAppointment.problem}
                      </p>
                    </div>

                    {/* Status */}
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(139, 92, 246, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <label style={{ 
                        fontWeight: '700',
                        color: '#8b5cf6',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.75rem'
                      }}>
                        Status
                      </label>
                      <span 
                        className={`status-badge status-${selectedAppointment.status.toLowerCase()}`}
                      >
                        {selectedAppointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Cancellation Reason - Show only if status is cancelled */}
                  {selectedAppointment.status === 'cancelled' && selectedAppointment.cancellation_reason && (
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(239, 68, 68, 0.2)',
                      marginTop: '1rem'
                    }}>
                      <label style={{ 
                        fontWeight: '700', 
                        display: 'block', 
                        marginBottom: '0.75rem',
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        ⚠️ Cancellation Reason
                      </label>
                      <p style={{ 
                        margin: 0,
                        color: '#1e293b', 
                        fontSize: '1rem',
                        lineHeight: '1.6'
                      }}>
                        {selectedAppointment.cancellation_reason}
                      </p>
                    </div>
                  )}
                </div>
                {/* Modal Footer */}
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  justifyContent: 'flex-end',
                  paddingTop: '1.5rem',
                  borderTop: '2px solid rgba(59, 130, 246, 0.1)'
                }}>
                  <button 
                    onClick={() => setShowModal(false)}
                    style={{ 
                      padding: '0.875rem 1.75rem', 
                      borderRadius: '12px', 
                      border: '2px solid #e2e8f0', 
                      background: 'white', 
                      cursor: 'pointer', 
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      color: '#64748b',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Close
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* Rejection Modal */}
          {showRejectModal && appointmentToReject && (
            <div 
              className="modal-overlay" 
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
                animation: 'fadeIn 0.3s ease-out'
              }}
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
                setAppointmentToReject(null);
              }}
            >
              <Card 
                style={{ 
                  width: '90%', 
                  maxWidth: '550px',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  animation: 'slideUp 0.3s ease-out',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '2rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '2px solid rgba(239, 68, 68, 0.1)'
                }}>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: '1.75rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Reject Appointment
                  </h2>
                  <button 
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason('');
                      setAppointmentToReject(null);
                    }}
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      border: 'none', 
                      fontSize: '1.5rem', 
                      cursor: 'pointer',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ef4444',
                      fontWeight: '700',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.transform = 'rotate(90deg)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.transform = 'rotate(0deg)';
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Appointment Info */}
                <div style={{
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%)',
                  borderRadius: '12px',
                  border: '2px solid rgba(239, 68, 68, 0.1)',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    <strong style={{ color: '#1e293b' }}>Patient:</strong> {appointmentToReject.patient}
                  </p>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    <strong style={{ color: '#1e293b' }}>Date:</strong> {appointmentToReject.date}
                  </p>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>
                    <strong style={{ color: '#1e293b' }}>Problem:</strong> {appointmentToReject.problem}
                  </p>
                </div>

                {/* Rejection Reason Textarea */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ 
                    fontWeight: '700', 
                    display: 'block', 
                    marginBottom: '0.75rem',
                    color: '#1e293b',
                    fontSize: '0.95rem'
                  }}>
                    Reason for Rejection <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Please provide a detailed reason for rejecting this appointment..."
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.borderColor = '#ef4444';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Modal Footer */}
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  justifyContent: 'flex-end',
                  paddingTop: '1.5rem',
                  borderTop: '2px solid rgba(239, 68, 68, 0.1)'
                }}>
                  <button 
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason('');
                      setAppointmentToReject(null);
                    }}
                    style={{ 
                      padding: '0.875rem 1.75rem', 
                      borderRadius: '12px', 
                      border: '2px solid #e2e8f0', 
                      background: 'white', 
                      cursor: 'pointer', 
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      color: '#64748b',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRejectAppointment}
                    disabled={!rejectionReason.trim() || updatingId === appointmentToReject.id}
                    style={{ 
                      padding: '0.875rem 1.75rem', 
                      borderRadius: '12px', 
                      border: 'none',
                      background: (!rejectionReason.trim() || updatingId === appointmentToReject.id) 
                        ? '#cbd5e1' 
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      cursor: (!rejectionReason.trim() || updatingId === appointmentToReject.id) 
                        ? 'not-allowed' 
                        : 'pointer',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s',
                      boxShadow: (!rejectionReason.trim() || updatingId === appointmentToReject.id) 
                        ? 'none' 
                        : '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      if (rejectionReason.trim() && updatingId !== appointmentToReject.id) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = rejectionReason.trim() && updatingId !== appointmentToReject.id
                        ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                        : 'none';
                    }}
                  >
                    {updatingId === appointmentToReject.id ? 'Processing...' : 'Reject Appointment'}
                  </button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Appointments;
