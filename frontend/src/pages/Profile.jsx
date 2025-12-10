import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, Edit2, Save, X, Award, Activity, Heart } from 'lucide-react';
import Card from '../components/Card';
import api from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const res = await api.get('/api/auth/me/patient');
        setProfile(res.data);
        setEditedProfile(res.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      // Here you would call an API to update the profile
      // await api.put('/api/auth/me/patient', editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <p style={{ color: '#1e40af', fontSize: '1.2rem', fontWeight: '600' }}>Loading...</p>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <p style={{ color: '#1e40af', fontSize: '1.2rem', fontWeight: '600' }}>{error}</p>
    </div>
  );
  
  if (!profile) return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <p style={{ color: '#1e40af', fontSize: '1.2rem', fontWeight: '600' }}>No profile data</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)', 
      padding: '2rem' 
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          marginBottom: '2rem', 
          textAlign: 'center' 
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            My Profile
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Manage your personal information
          </p>
        </div>
        
        <Card style={{ 
          padding: '2.5rem', 
          borderRadius: '24px', 
          boxShadow: '0 10px 40px rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.1)'
        }}>
          
          {/* Header with Edit Button */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '2px solid rgba(59, 130, 246, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: '900',
                color: 'white',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                flexShrink: 0
              }}>
                {profile.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>
                  {profile.name}
                </h2>
                <div style={{
                  display: 'inline-block',
                  padding: '0.35rem 1rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <p style={{ margin: 0, color: '#3b82f6', fontWeight: '700', fontSize: '0.9rem' }}>Patient</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div style={{ 
            display: 'grid',
            gap: '1.5rem'
          }}>

            {/* Stats Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(59, 130, 246, 0.15)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 5px 15px rgba(59, 130, 246, 0.3)'
                }}>
                  <Activity size={32} style={{ color: 'white' }} />
                </div>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1.75rem', fontWeight: '800', color: '#1A202C' }}>5</h3>
                <p style={{ margin: 0, color: '#3b82f6', fontWeight: '600', fontSize: '0.9rem' }}>Total Visits</p>
              </div>
              <div style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(16, 185, 129, 0.15)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 5px 15px rgba(16, 185, 129, 0.3)'
                }}>
                  <Heart size={32} style={{ color: 'white' }} />
                </div>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1.75rem', fontWeight: '800', color: '#1A202C' }}>4</h3>
                <p style={{ margin: 0, color: '#10b981', fontWeight: '600', fontSize: '0.9rem' }}>Active Plans</p>
              </div>
              <div style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(239, 68, 68, 0.15)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 5px 15px rgba(239, 68, 68, 0.3)'
                }}>
                  <Award size={32} style={{ color: 'white' }} />
                </div>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1.75rem', fontWeight: '800', color: '#1A202C' }}>
                  {Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24))}
                </h3>
                <p style={{ margin: 0, color: '#ef4444', fontWeight: '600', fontSize: '0.9rem' }}>Days Member</p>
              </div>
            </div>

            {/* Divider */}
            <div style={{ 
              height: '2px', 
              background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)', 
              marginBottom: '2rem' 
            }}></div>

            {/* Info Section Title */}
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: '#1A202C',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '4px',
                height: '24px',
                borderRadius: '2px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              }}></div>
              Personal Information
            </h3>

            {/* Info Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Contact Number */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(37, 99, 235, 0.03) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(59, 130, 246, 0.1)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}>
                  <Phone size={24} style={{ color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#3b82f6', fontWeight: '600', marginBottom: '0.25rem' }}>
                    Contact Number
                  </p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.contact}
                      onChange={(e) => setEditedProfile({...editedProfile, contact: e.target.value})}
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: '#1A202C',
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        width: '100%',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  ) : (
                    <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1A202C' }}>
                      {profile.contact}
                    </p>
                  )}
                </div>
              </div>

              {/* Email (if available) */}
              {(profile.email || isEditing) && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(37, 99, 235, 0.03) 100%)',
                  borderRadius: '16px',
                  border: '2px solid rgba(59, 130, 246, 0.1)',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                  }}>
                    <Mail size={24} style={{ color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#3b82f6', fontWeight: '600', marginBottom: '0.25rem' }}>
                      Email Address
                    </p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: '#1A202C',
                          border: '2px solid #3b82f6',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          width: '100%',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    ) : (
                      <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1A202C' }}>
                        {profile.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Member Since */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(37, 99, 235, 0.03) 100%)',
                borderRadius: '16px',
                border: '2px solid rgba(59, 130, 246, 0.1)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}>
                  <Calendar size={24} style={{ color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#3b82f6', fontWeight: '600', marginBottom: '0.25rem' }}>
                    Member Since
                  </p>
                  <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1A202C' }}>
                    {new Date(profile.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </Card>
      </div>
    </div>
  );
};
export default Profile;
