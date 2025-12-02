import React from 'react';
import { Users, Calendar, UserCircle, TrendingUp, Activity, Clock } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
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
  ];

  const recentAppointments = [];

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
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Clock size={18} />
            View Reports
          </button>
          <button className="btn-primary">
            <Activity size={18} />
            Quick Actions
          </button>
        </div>
      </div>

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

      <div className="dashboard-grid">
        <Card title="Recent Appointments" icon={Calendar} className="appointments-card">
          <Table 
            columns={appointmentColumns} 
            data={recentAppointments}
          />
        </Card>

        <Card title="Quick Stats" icon={Activity} className="quick-stats-card">
          <div className="quick-stats">
            <div className="quick-stat-item">
              <div className="quick-stat-label">Waiting Patients</div>
              <div className="quick-stat-value">12</div>
            </div>
            <div className="quick-stat-item">
              <div className="quick-stat-label">Available Rooms</div>
              <div className="quick-stat-value">8</div>
            </div>
            <div className="quick-stat-item">
              <div className="quick-stat-label">On Leave</div>
              <div className="quick-stat-value">3</div>
            </div>
            <div className="quick-stat-item">
              <div className="quick-stat-label">Emergency Cases</div>
              <div className="quick-stat-value">2</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
