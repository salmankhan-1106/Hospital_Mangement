import React, { useState } from 'react';
import { Plus, Calendar, Clock, Filter } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import './Appointments.css';

const Appointments = () => {
  const appointments = [];

  const columns = [
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
        <div className="action-buttons">
          <button className="btn-action btn-view">View</button>
          <button className="btn-action btn-edit">Edit</button>
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

      <div className="appointments-filters">
        <button className="filter-btn active">
          <Calendar size={18} />
          Today
        </button>
        <button className="filter-btn">
          <Calendar size={18} />
          This Week
        </button>
        <button className="filter-btn">
          <Calendar size={18} />
          This Month
        </button>
        <button className="filter-btn">
          <Filter size={18} />
          All
        </button>
      </div>

      <Card className="appointments-card">
        <Table columns={columns} data={appointments} />
      </Card>
    </div>
  );
};

export default Appointments;
