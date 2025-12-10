import React, { useState, useEffect } from 'react';
import { Mail, Phone, Briefcase, Award, MapPin, Edit2, Save, X } from 'lucide-react';
import Card from '../components/Card';
import api from '../api';

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    specialization: '',
    experience: '',
    department: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/doctors/me');
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        qualification: res.data.qualification || '',
        specialization: res.data.specialization || '',
        experience: res.data.experience || '',
        department: res.data.department || '',
        bio: res.data.bio || ''
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/api/doctors/me', formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      qualification: profile?.qualification || '',
      specialization: profile?.specialization || '',
      experience: profile?.experience || '',
      department: profile?.department || '',
      bio: profile?.bio || ''
    });
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>No profile data</p>;

  return (
    <div className="profile" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Doctor Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your professional information</p>
        </div>
      </div>

      {/* Profile Header */}
      <Card style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 'bold',
            marginRight: '2rem'
          }}>
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Dr. {profile.name}</h2>
            <p style={{ margin: '0', color: 'var(--text-secondary)' }}>{profile.specialization || 'Medical Professional'}</p>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--primary-color)', fontWeight: '600' }}>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Profile Content */}
      {!isEditing ? (
        // View Mode
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Mail size={20} style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }} />
                <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Email</label>
              </div>
              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>{profile.email}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Phone size={20} style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }} />
                <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Phone</label>
              </div>
              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>{profile.phone || 'Not provided'}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Award size={20} style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }} />
                <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Qualification</label>
              </div>
              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>{profile.qualification || 'Not provided'}</p>
            </div>
          </Card>

          <Card style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Briefcase size={20} style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }} />
                <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Specialization</label>
              </div>
              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>{profile.specialization || 'Not provided'}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <MapPin size={20} style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }} />
                <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Department</label>
              </div>
              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>{profile.department || 'Not provided'}</p>
            </div>

            <div>
              <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Years of Experience</label>
              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>{profile.experience || 'Not provided'}</p>
            </div>
          </Card>
        </div>
      ) : (
        // Edit Mode
        <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Edit Profile Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Phone</label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92-300-1234567"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Qualification</label>
              <input 
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g., MBBS, MD Cardiology"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Specialization</label>
              <input 
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Cardiology"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Department</label>
              <input 
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Cardiology Department"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Years of Experience</label>
            <input 
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 10 years"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Professional Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a brief professional bio..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'inherit', minHeight: '100px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleCancel}
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}
            >
              <X size={18} />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '5px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </Card>
      )}

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Appointments</p>
          <h3 style={{ margin: '0', fontSize: '2.5rem', color: 'var(--primary-color)' }}>—</h3>
        </Card>
        <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Completion Rate</p>
          <h3 style={{ margin: '0', fontSize: '2.5rem', color: 'var(--primary-color)' }}>—%</h3>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
