import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Users } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import './Patients.css';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const patients = [];

  const columns = [
    { header: 'Patient Name', key: 'name', width: '20%' },
    { header: 'Age', key: 'age', width: '10%' },
    { header: 'Gender', key: 'gender', width: '10%' },
    { header: 'Phone', key: 'phone', width: '15%' },
    { header: 'Last Visit', key: 'lastVisit', width: '15%' },
    { header: 'Condition', key: 'condition', width: '20%' },
    {
      header: 'Actions',
      key: 'actions',
      width: '10%',
      render: (row) => (
        <div className="action-buttons">
          <button className="btn-action btn-view">View</button>
          <button className="btn-action btn-edit">Edit</button>
        </div>
      )
    }
  ];

  return (
    <div className="patients-page">
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p className="page-subtitle">View all registered patient records</p>
        </div>
      </div>

      <Card className="patients-card">
        <div className="patients-toolbar">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search patients by name, phone, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="toolbar-actions">
            <button className="btn-secondary">
              <Filter size={18} />
              Filter
            </button>
            <button className="btn-secondary">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <Table columns={columns} data={patients} />

        <div className="pagination">
          <button className="pagination-btn">Previous</button>
          <div className="pagination-numbers">
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-number">3</button>
          </div>
          <button className="pagination-btn">Next</button>
        </div>
      </Card>

      <div className="patients-stats">
        <div className="stat-box">
          <Users size={24} className="stat-box-icon" />
          <div className="stat-box-content">
            <div className="stat-box-value">1,234</div>
            <div className="stat-box-label">Total Patients</div>
          </div>
        </div>
        <div className="stat-box">
          <Users size={24} className="stat-box-icon" />
          <div className="stat-box-content">
            <div className="stat-box-value">156</div>
            <div className="stat-box-label">New This Month</div>
          </div>
        </div>
        <div className="stat-box">
          <Users size={24} className="stat-box-icon" />
          <div className="stat-box-content">
            <div className="stat-box-value">89</div>
            <div className="stat-box-label">Active Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
