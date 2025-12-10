import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Activity, Bell, Heart, TrendingUp, RefreshCw } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import api from '../api';
import './Dashboard.css';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcoming: 0,
    pending: 0,
    completed: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      console.log('Fetching patient dashboard data...');
      const appointmentsRes = await api.get('/api/appointments/my');
      const appointments = appointmentsRes.data || [];
      console.log('Appointments:', appointments);

      setRecentAppointments(appointments.map(appt => ({
        id: appt.id,
        doctor: appt.doctor?.name || 'Unassigned',
        date: new Date(appt.created_at).toLocaleDateString(),
        time: new Date(appt.created_at).toLocaleTimeString(),
        status: appt.status
      })));

      setStats({
        totalAppointments: appointments.length,
        upcoming: appointments.filter(a => a.status === 'pending' || a.status === 'upcoming').length,
        pending: appointments.filter(a => a.status === 'pending').length,
        completed: appointments.filter(a => a.status === 'completed').length
      });
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load appointments. Make sure backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const statItems = [
    { title: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', trend: '+12%' },
    { title: 'Upcoming', value: stats.upcoming, icon: Clock, color: '#0ea5e9', bgColor: 'rgba(14, 165, 233, 0.1)', trend: '+5%' },
    { title: 'Pending', value: stats.pending, icon: Activity, color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)', trend: '-2%' },
    { title: 'Completed', value: stats.completed, icon: Heart, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', trend: '+8%' }
  ];

  const appointmentColumns = [
    { header: 'Doctor', key: 'doctor' },
    { header: 'Date', key: 'date' },
    { header: 'Time', key: 'time' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span>
    }
  ];

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
      <div className="dashboard">
        <div className="dashboard-header" style={{ 
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
              My Dashboard
            </h1>
            <p style={{ 
              fontSize: '1.1rem',
              color: '#3b82f6',
              fontWeight: '500'
            }}>
              Welcome back! View your health summary.
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: refreshing ? 0.7 : 1,
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (!refreshing) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="stats-grid">
          {statItems.map((stat, index) => (
            <Card key={index} className="stat-card stat-card-hover" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.08)',
              transition: 'all 0.3s ease'
            }}>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <div className="stat-value-row">
                    <h2 className="stat-value">{stat.value}</h2>
                    <span className="stat-trend" style={{ color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                      <TrendingUp size={16} />
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className="stat-icon stat-icon-animated" style={{ background: stat.bgColor }}>
                  <stat.icon size={32} style={{ color: stat.color }} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card title="Recent Appointments" icon={Calendar} className="appointments-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.08)'
        }}>
          <Table columns={appointmentColumns} data={recentAppointments} />
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;