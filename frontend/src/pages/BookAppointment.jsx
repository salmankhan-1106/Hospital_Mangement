import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, User, FileText, ChevronRight, Star, Award, Briefcase, Phone, Mail, MapPin, Check } from 'lucide-react';
import api from '../api'; // Assuming this is your axios instance for API calls

// Simple Card Component
const Card = ({ children, style, className }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    ...style
  }}
  className={className}>
    {children}
  </div>
);

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Fill Details, 3: Confirm
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
 
  // Appointment details
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [problem, setProblem] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [duration, setDuration] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentCode, setAppointmentCode] = useState('');

  // Default time slots since backend doesn't provide them
  const defaultTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
  ];

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentUser) {
      setPatientName(currentUser.name || '');
      setPatientPhone(currentUser.contact || '');
    }

    const fetchDoctors = async () => {
      try {
        const response = await api.get('/api/doctors');
        setDoctors(response.data || []);
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = ['all', ...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || d.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
   
    try {
      const response = await api.post('/api/appointments/', {
        doctor_id: selectedDoctor.id,
        problem,
        severity,
        duration,
        medical_history: medicalHistory,
        // Backend doesn't support date/time yet; add if updated
        // date: appointmentDate,
        // time: appointmentTime
      });
      setAppointmentCode(response.data.appointment_code);
      setStep(3);
    } catch (err) {
      console.error('Booking error:', err);
      // Handle error (e.g., set error state)
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDoctor(null);
    setAppointmentDate('');
    setAppointmentTime('');
    setProblem('');
    setSeverity('moderate');
    setDuration('');
    setMedicalHistory('');
    setPatientName('');
    setPatientPhone('');
    setAppointmentCode('');
  };

  // Step 1: Select Doctor
  if (step === 1) {
    return (
      <div style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)', 
        minHeight: '100vh' 
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 0.5rem 0', 
            fontSize: '2.5rem', 
            fontWeight: '800'
          }}>
            Book an Appointment
          </h1>
          <p style={{ 
            color: '#475569', 
            margin: 0, 
            fontSize: '1.125rem',
            fontWeight: '500'
          }}>
            Select a doctor to get started with your consultation
          </p>
        </div>

        {/* Progress Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: '700',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}>1</div>
            <span style={{ color: '#1e293b', fontWeight: '600' }}>Select Doctor</span>
          </div>
          <ChevronRight style={{ color: '#cbd5e1' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: '600'
            }}>2</div>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Enter Details</span>
          </div>
          <ChevronRight style={{ color: '#cbd5e1' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: '600'
            }}>3</div>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Confirmation</span>
          </div>
        </div>

        {/* Search and Filter */}
        <Card style={{ 
          padding: '1.5rem', 
          marginBottom: '2rem', 
          maxWidth: '1200px', 
          margin: '0 auto 2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '300px',
              background: '#f8f9fa', borderRadius: '12px', padding: '0 1rem', border: '2px solid #e2e8f0'
            }}>
              <Search size={18} style={{ color: '#3b82f6' }} />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  padding: '0.875rem', 
                  width: '100%', 
                  color: '#1e293b', 
                  fontSize: '0.95rem', 
                  fontFamily: 'inherit',
                  fontWeight: '500'
                }}
              />
            </div>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                style={{ 
                  padding: '0.875rem 1.5rem', 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  cursor: 'pointer', 
                  fontSize: '0.95rem', 
                  fontWeight: '700', 
                  fontFamily: 'inherit', 
                  width: '100%',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)',
                  transition: 'all 0.3s ease',
                  appearance: 'none',
                  paddingRight: '3rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 30px rgba(59, 130, 246, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {specialties.map(spec => (
                  <option key={spec} value={spec} style={{ background: '#1e293b', color: 'white' }}>
                    {spec === 'all' ? 'All Specialties' : `⚕️ ${spec}`}
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'white',
                fontSize: '1.2rem'
              }}>▼</div>
            </div>
          </div>
        </Card>

        {/* Doctors Grid */}
        {loading && <p style={{ textAlign: 'center', color: '#3b82f6', fontSize: '1.2rem', fontWeight: '600' }}>Loading...</p>}
        
        {!loading && (
          <>
            <style>{`
              .doctor-card-modern {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                padding: 2rem;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                transition: all 0.3s ease;
                border: 2px solid transparent;
                backdrop-filter: blur(10px);
              }
              .doctor-card-modern:hover {
                transform: translateY(-10px);
                box-shadow: 0 15px 50px rgba(59, 130, 246, 0.3);
                border-color: #3b82f6;
              }
              .doctor-avatar-modern {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: 800;
                color: white;
                margin: 0 auto 1.5rem;
                box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
              }
              .doctor-name-modern {
                font-size: 1.5rem;
                font-weight: 800;
                color: #1e293b;
                margin: 0 0 0.5rem 0;
                text-align: center;
              }
              .doctor-specialty-modern {
                color: #3b82f6;
                font-weight: 600;
                font-size: 0.95rem;
                text-align: center;
                margin-bottom: 1.5rem;
              }
              .doctor-details-modern {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
                border-radius: 12px;
              }
              .detail-item-modern {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #475569;
                font-size: 0.9rem;
              }
              .detail-item-modern svg {
                color: #3b82f6;
                flex-shrink: 0;
              }
              .btn-select-doctor {
                width: 100%;
                padding: 0.875rem;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
              }
              .btn-select-doctor:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
              }
            `}</style>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card-modern">
                  <div className="doctor-avatar-modern">
                    {doctor.name.charAt(0)}
                  </div>
                  <h3 className="doctor-name-modern">Dr. {doctor.name}</h3>
                  <p className="doctor-specialty-modern">{doctor.specialization || 'General Practitioner'}</p>
                  
                  <div className="doctor-details-modern">
                    <div className="detail-item-modern">
                      <Mail size={18} />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="detail-item-modern">
                      <Briefcase size={18} />
                      <span>Experience: {doctor.experience || 'N/A'}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-select-doctor" 
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    Select Doctor
                  </button>
                </div>
              ))}
              {filteredDoctors.length === 0 && (
                <p style={{ 
                  textAlign: 'center', 
                  color: '#475569', 
                  fontSize: '1.1rem',
                  gridColumn: '1 / -1'
                }}>
                  No doctors available
                </p>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
// Step 2: Enter Details
if (step === 2) {
  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)', 
      minHeight: '100vh' 
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ 
            color: 'white', 
            margin: '0 0 0.5rem 0', 
            fontSize: '2.5rem', 
            fontWeight: '800',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Appointment Details
          </h1>
          <p style={{ 
            color: '#475569', 
            margin: 0, 
            fontSize: '1.125rem',
            fontWeight: '500'
          }}>
            Fill in your information to complete the booking
          </p>
        </div>

        {/* Selected Doctor Info */}
        <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: 'white',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}>
              {selectedDoctor.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#1A202C' }}>
                Dr. {selectedDoctor.name}
              </h3>
              <p style={{ margin: 0, color: '#3b82f6', fontWeight: '600' }}>{selectedDoctor.specialization}</p>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Patient Info */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1A202C', fontSize: '0.95rem' }}>
                  <User size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#f8f9fa',
                    color: '#1A202C',
                    transition: 'all 0.2s',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8f9fa';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1A202C', fontSize: '0.95rem' }}>
                  <Phone size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                  placeholder="+92-300-1234567"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#f8f9fa',
                    color: '#1A202C',
                    transition: 'all 0.2s',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8f9fa';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Date and Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1A202C', fontSize: '0.95rem' }}>
                    <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      background: '#f8f9fa',
                      color: '#1A202C',
                      transition: 'all 0.2s',
                      fontWeight: '500'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.background = 'white';
                      e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8f9fa';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1A202C', fontSize: '0.95rem' }}>
                    <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Time *
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer',
                      background: '#f8f9fa',
                      color: '#1A202C',
                      fontWeight: '500'
                    }}
                  >
                    <option value="">Select time</option>
                    {defaultTimeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1A202C', fontSize: '0.95rem' }}>
                  <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                  Describe Your Problem *
                </label>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  required
                  placeholder="Please describe your symptoms or reason for visit..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.2s',
                    background: '#f8f9fa',
                    color: '#1A202C',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8f9fa';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Condition Severity */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1A202C', fontSize: '0.95rem' }}>
                  <Award size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                  Condition Severity *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#f8f9fa',
                    color: '#1A202C',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8f9fa';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="mild">Mild - Minor symptoms, can wait</option>
                  <option value="moderate">Moderate - Regular symptoms, need soon</option>
                  <option value="severe">Severe - Urgent symptoms, need immediate care</option>
                </select>
              </div>

              {/* Duration of Condition */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1A202C', fontSize: '0.95rem' }}>
                  <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                  How Long Have You Had This Condition? *
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  placeholder="e.g., 2 days, 1 week, 3 months"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: '#f8f9fa',
                    color: '#1A202C',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8f9fa';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Medical History */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1A202C', fontSize: '0.95rem' }}>
                  <Briefcase size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                  Medical History & Previous Diseases
                </label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="List any previous diseases, allergies, medications, or relevant medical history... (Optional)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.2s',
                    background: '#f8f9fa',
                    color: '#1A202C',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8f9fa';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: 'white',
                    color: '#3b82f6',
                    border: '2px solid #3b82f6',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{
                    flex: 2,
                    padding: '0.875rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseOver={(e) => !submitLoading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.5)')}
                  onMouseOut={(e) => !submitLoading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)')}
                >
                  {submitLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
// Step 3: Confirmation
return (
  <div style={{ 
    padding: '2rem', 
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)', 
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div style={{ maxWidth: '600px', width: '100%' }}>
      <Card style={{ padding: '3rem', textAlign: 'center' }}>
        {/* Success Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
          animation: 'successPulse 2s ease-in-out infinite'
        }}>
          <Check size={50} />
        </div>
        
        <style>{`
          @keyframes successPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>

        {/* Heading */}
        <h1 style={{ 
          color: '#1A202C', 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          margin: '0 0 0.5rem 0',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: '#4A5568', fontSize: '1.125rem', marginBottom: '2rem', fontWeight: '500' }}>
          Your appointment has been successfully booked
        </p>

        {/* Appointment Details */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)', 
          padding: '2rem', 
          borderRadius: '16px', 
          marginBottom: '2rem', 
          border: '2px solid #e2e8f0', 
          textAlign: 'left' 
        }}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
            <div style={{ color: '#3b82f6', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Appointment Code
            </div>
            <div style={{ 
              color: '#1A202C', 
              fontSize: '1.75rem', 
              fontWeight: '800', 
              letterSpacing: '0.1em',
              fontFamily: 'monospace'
            }}>
              {appointmentCode}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>Doctor:</span>
              <span style={{ color: '#1A202C', fontWeight: '700' }}>Dr. {selectedDoctor.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>Date:</span>
              <span style={{ color: '#1A202C', fontWeight: '700' }}>{appointmentDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>Time:</span>
              <span style={{ color: '#1A202C', fontWeight: '700' }}>{appointmentTime}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>Patient:</span>
              <span style={{ color: '#1A202C', fontWeight: '700' }}>{patientName}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Note */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          marginBottom: '2rem',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#059669', fontSize: '1.2rem', margin: '0 0 0.5rem 0', fontWeight: '700', lineHeight: '1.6' }}>
            Your appointment has been confirmed!
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0, fontWeight: '500' }}>
            Save your appointment code for future reference
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <button
            onClick={resetForm}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
            }}
          >
            Book Another Appointment
          </button>
          <button
            onClick={() => navigate('/patient/dashboard')}
            style={{
              padding: '1rem',
              background: 'white',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </Card>
    </div>
  </div>
);

};

export default BookAppointment;