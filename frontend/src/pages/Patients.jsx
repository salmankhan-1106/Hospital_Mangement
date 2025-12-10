import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Users, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userType] = useState('doctor'); // Simulated user type
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Simulated patient data
        const mockPatients = [
          { id: 1, name: 'John Doe', contact: '+92-300-1234567', appointmentCount: 5, lastVisit: '12/01/2025' },
          { id: 2, name: 'Jane Smith', contact: '+92-321-7654321', appointmentCount: 3, lastVisit: '12/03/2025' },
          { id: 3, name: 'Ahmed Khan', contact: '+92-333-9876543', appointmentCount: 8, lastVisit: '12/05/2025' },
          { id: 4, name: 'Sara Ali', contact: '+92-345-1112233', appointmentCount: 2, lastVisit: '11/28/2025' },
          { id: 5, name: 'Hassan Raza', contact: '+92-300-4445566', appointmentCount: 6, lastVisit: '12/04/2025' },
        ];
        
        setTimeout(() => {
          setPatients(mockPatients);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Failed to load patients:', err);
        setError('Failed to load patient list');
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    const csv = [
      ['Name', 'Contact', 'Appointments', 'Last Visit'],
      ...filteredPatients.map(p => [p.name, p.contact, p.appointmentCount, p.lastVisit])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
  };

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#1e293b', margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700' }}>Patients</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>View and manage registered patient records</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fee2e2' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
              <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
            </div>
            <p style={{ marginTop: '1rem' }}>Loading patients...</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px', background: '#f8fafc', borderRadius: '8px', padding: '0 0.75rem', border: '1px solid #e2e8f0' }}>
                <Search size={18} style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search by name or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    outline: 'none', 
                    padding: '0.75rem', 
                    width: '100%',
                    color: '#1e293b',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    padding: '0.75rem 1rem', 
                    background: '#f8fafc', 
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <Filter size={18} />
                  Filter
                </button>
                <button 
                  onClick={handleExport}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    padding: '0.75rem 1rem', 
                    background: '#f8fafc', 
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient Name</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appointments</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Visit</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPatients.map((patient) => (
                    <tr key={patient.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '500' }}>{patient.name}</td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{patient.contact}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.875rem' }}>
                          {patient.appointmentCount}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{patient.lastVisit}</td>
                      <td style={{ padding: '1rem' }}>
                        <button 
                          style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#3b82f6', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPatients.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <Users size={48} style={{ margin: '0 auto 1rem', opacity: '0.5' }} />
                <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#64748b' }}>No patients found</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try adjusting your search criteria</p>
              </div>
            )}

            {filteredPatients.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: currentPage === 1 ? '#f1f5f9' : 'white',
                      color: currentPage === 1 ? '#94a3b8' : '#475569',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: currentPage === totalPages ? '#f1f5f9' : 'white',
                      color: currentPage === totalPages ? '#94a3b8' : '#475569',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#dbeafe', padding: '0.75rem', borderRadius: '10px' }}>
                <Users size={24} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>{patients.length}</div>
                <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Total Patients</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '10px' }}>
                <Users size={24} style={{ color: '#16a34a' }} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>{Math.ceil(patients.length * 0.15)}</div>
                <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>New This Month</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '10px' }}>
                <Users size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>{Math.ceil(patients.length * 0.08)}</div>
                <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Active Today</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;