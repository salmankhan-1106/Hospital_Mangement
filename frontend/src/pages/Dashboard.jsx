import React, { useState, useEffect } from 'react';
import { Users, Calendar, UserCircle, TrendingUp, Activity, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const userType = localStorage.getItem('userType');
  const [stats, setStats] = useState(
    userType === 'doctor'
      ? [
          {
            title: "Today's Appointments",
            value: '0',
            change: '+0%',
            icon: Calendar,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
          },
          {
            title: 'Pending Appointments',
            value: '0',
            change: '+0%',
            icon: Clock,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)'
          },
          {
            title: 'Completed Today',
            value: '0',
            change: '+0%',
            icon: Activity,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
          }
        ]
      : [
          {
            title: 'Total Patients',
            value: '0',
            change: '+0%',
            icon: Users,
            color: '#4f46e5',
            bgColor: 'rgba(79, 70, 229, 0.1)'
          },
          {
            title: "Today's Appointments",
            value: '0',
            change: '+0%',
            icon: Calendar,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
          },
          {
            title: 'Pending Appointments',
            value: '0',
            change: '+0%',
            icon: Clock,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)'
          },
          {
            title: 'Completed Today',
            value: '0',
            change: '+0%',
            icon: Activity,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
          }
        ]
  );
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [appointmentsAll, setAppointmentsAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let appointments = [];
        let patients = [];
        if (userType === 'doctor') {
          // Doctor: fetch own appointments and profile
          try {
            const appointmentsRes = await api.get('/api/appointments/my');
            appointments = appointmentsRes.data || [];
          } catch (err) {
            console.error('Error fetching doctor appointments:', err);
          }
          try {
            const profileRes = await api.get('/api/doctors/me');
            setDoctorProfile(profileRes.data);
          } catch (err) {
            console.error('Error fetching doctor profile:', err);
          }
        } else {
          // Patient: fetch own appointments only (no /api/patients endpoint available)
          try {
            const appointmentsRes = await api.get('/api/appointments/my');
            appointments = appointmentsRes.data || [];
          } catch (err) {
            console.error('Error fetching patient appointments:', err);
          }
          patients = []; // Patients cannot view all patients list
        }
        const pending = appointments.filter(a => a.status === 'pending').length;
        const completed = appointments.filter(a => a.status === 'completed').length;
        const completionRate = appointments.length > 0 ? Math.round((completed / appointments.length) * 100) : 0;
        
        setStats(prevStats => prevStats.map(stat => {
          if (stat.title === 'Total Patients') return { ...stat, value: patients.length.toString() };
          if (stat.title === "Today's Appointments") return { ...stat, value: appointments.length.toString() };
          if (stat.title === 'Pending Appointments') return { ...stat, value: pending.toString() };
          if (stat.title === 'Completed Today') return { ...stat, value: completed.toString() };
          return stat;
        }));
        
        setRecentAppointments(appointments.slice(0, 10).map(appt => ({
          id: appt.id,
          patient: appt.patient?.name || 'Unknown',
          doctor: appt.doctor?.name || 'Unassigned',
          time: new Date(appt.created_at).toLocaleTimeString(),
          status: appt.status,
          problem: appt.problem
        })));
        setAppointmentsAll(appointments);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userType]);

  const appointmentColumns = [
    { header: 'Patient', key: 'patient' },
    { header: 'Doctor', key: 'doctor' },
    { header: 'Time', key: 'time' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className={`status-badge status-${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      )
    },
    ...(userType === 'doctor' ? [{
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="appointment-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          {row.status === 'pending' && (
            <>
              <button 
                onClick={() => handleUpdateStatus(row.id, 'completed')}
                className="btn-sm btn-success"
                disabled={updatingAppointmentId === row.id}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                {updatingAppointmentId === row.id ? 'Updating...' : 'Complete'}
              </button>
            </>
          )}
        </div>
      )
    }] : [])
  ];

  // Filter appointments by status
  const filteredAppointments = statusFilter === 'all' 
    ? recentAppointments 
    : recentAppointments.filter(apt => apt.status === statusFilter);

  // Handle appointment status update
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    setUpdatingAppointmentId(appointmentId);
    try {
      await api.put(`/api/appointments/${appointmentId}`, { status: newStatus });
      // Refresh data
      const appointmentsRes = await api.get('/api/appointments/my');
      const appointments = appointmentsRes.data || [];
      setRecentAppointments(appointments.slice(0, 10).map(appt => ({
        id: appt.id,
        patient: appt.patient?.name || 'Unknown',
        doctor: appt.doctor?.name || 'Unassigned',
        time: new Date(appt.created_at).toLocaleTimeString(),
        status: appt.status,
        problem: appt.problem
      })));
      setAppointmentsAll(appointments);
    } catch (err) {
      console.error('Failed to update appointment:', err);
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          {userType === 'doctor' && doctorProfile && (
            <p className="dashboard-subtitle">Welcome, Dr. {doctorProfile.name}! Here's your today's summary.</p>
          )}
          {userType !== 'doctor' && (
            <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
          )}
        </div>
        <div className="header-actions">
          {userType === 'doctor' && (
            <button className="btn-primary" onClick={() => window.location.href = '/appointments'}>
              <Calendar size={18} />
              View All
            </button>
          )}
        </div>
      </div>

      {loading && <p>Loading dashboard data...</p>}
      
      {!loading && (
        <>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <Card key={index} className="stat-card">
                <div className="stat-content">
                  <div className="stat-info">
                    <p className="stat-title">{stat.title}</p>
                    <h2 className="stat-value">{stat.value}</h2>
                    <span className="stat-change positive">{stat.change} from last month</span>
                  </div>
                  <div className="stat-icon" style={{ background: stat.bgColor }}>
                    <stat.icon size={28} style={{ color: stat.color }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {userType === 'doctor' && (
            <div className="dashboard-filters" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)',
                  background: statusFilter === 'all' ? 'var(--primary-color)' : 'transparent',
                  color: statusFilter === 'all' ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)',
                  background: statusFilter === 'pending' ? '#f59e0b' : 'transparent',
                  color: statusFilter === 'pending' ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)',
                  background: statusFilter === 'completed' ? '#10b981' : 'transparent',
                  color: statusFilter === 'completed' ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Completed
              </button>
            </div>
          )}

          <div className="dashboard-grid">
            <Card title="Appointments" icon={Calendar} className="appointments-card">
              <Table 
                columns={appointmentColumns} 
                data={filteredAppointments}
              />
            </Card>

            <Card title="Quick Stats" icon={Activity} className="quick-stats-card">
              <div className="quick-stats">
                {(() => {
                  const TOTAL_ROOMS = 10;
                  const waiting = (appointmentsAll || []).filter(a => a.status === 'pending').length;
                  const availableRooms = Math.max(0, TOTAL_ROOMS - waiting);
                  const onLeave = 0;
                  const emergency = (appointmentsAll || []).filter(a => ['emergency', 'critical'].includes((a.status || '').toLowerCase())).length;
                  return (
                    <>
                      <div className="quick-stat-item">
                        <div className="quick-stat-label">Waiting Patients</div>
                        <div className="quick-stat-value">{waiting}</div>
                      </div>
                      <div className="quick-stat-item">
                        <div className="quick-stat-label">Available Rooms</div>
                        <div className="quick-stat-value">{availableRooms}</div>
                      </div>
                      <div className="quick-stat-item">
                        <div className="quick-stat-label">On Leave</div>
                        <div className="quick-stat-value">{onLeave}</div>
                      </div>
                      <div className="quick-stat-item">
                        <div className="quick-stat-label">Emergency Cases</div>
                        <div className="quick-stat-value">{emergency}</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;


