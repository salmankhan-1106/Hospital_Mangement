import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Activity, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  UserCog,
  Heart,
  Shield,
  Clock,
  Award,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react';
import './Login.css';

const API_URL = 'http://localhost:8000';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState(null); // null, 'patient', 'admin'
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    contact: '',
    secret_key: '', // For admin registration
    qualification: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegistering) {
        // Check admin secret key before sending request
        if (loginType === 'admin' && formData.secret_key !== '123$') {
          setError('Invalid admin secret key.');
          setLoading(false);
          return;
        }
        
        // Registration logic
        const endpoint = loginType === 'admin' 
          ? `${API_URL}/api/auth/register/doctor`
          : `${API_URL}/api/auth/register/patient`;
        
        const registerData = loginType === 'admin' 
          ? {
              secret_key: formData.secret_key,
              name: formData.name,
              email: formData.email,
              password: formData.password,
              qualification: formData.qualification || null
            }
          : {
              name: formData.name,
              contact: formData.contact,
              password: formData.password
            };
        
        const response = await axios.post(endpoint, registerData);
        const { access_token, user } = response.data;
        
        if (loginType === 'admin') {
          // Switch to login mode after successful registration
          setIsRegistering(false);
          setFormData({
            ...formData,
            password: '',
            name: '',
            secret_key: '',
            qualification: ''
          });
          setError('');
          alert('Doctor account created successfully! Please login with your credentials.');
        } else {
          alert('Patient account created! Welcome, ' + user.name);
        }
      } else {
        // Login logic
        const endpoint = loginType === 'admin'
          ? `${API_URL}/api/auth/login/doctor`
          : `${API_URL}/api/auth/login/patient`;
        
        const loginData = loginType === 'admin'
          ? { email: formData.email, password: formData.password }
          : { contact: formData.contact, password: formData.password };
        
        const response = await axios.post(endpoint, loginData);

        const { access_token, user } = response.data;
        
        // Store token and user info
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        if (loginType === 'admin') {
          setIsAuthenticated(true);
          navigate('/dashboard');
        } else {
          alert('Patient portal coming soon! Welcome, ' + user.name);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        setError(err.response.data.detail || (isRegistering ? 'Registration failed' : 'Invalid email or password'));
      } else if (err.request) {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBack = () => {
    setLoginType(null);
    setIsRegistering(false);
    setFormData({ 
      email: '', 
      password: '',
      name: '',
      contact: '',
      secret_key: '',
      qualification: ''
    });
    setError('');
  };

  if (loginType === null) {
    return (
      <div className="landing-container">
        {/* Navigation */}
        <nav className="landing-nav">
          <div className="nav-logo">
            <Activity size={36} />
            <span>HealthCare Plus</span>
          </div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <Phone size={18} />
            <span>(555) 123-4567</span>
          </div>
        </nav>

        {/* Hero Section with Login */}
        <div className="landing-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your Health, <span className="highlight">Our Priority</span>
              </h1>
              <p className="hero-description">
                Experience world-class healthcare with cutting-edge technology and compassionate care. 
                Our state-of-the-art facility offers comprehensive medical services, ensuring your 
                well-being is in expert hands.
              </p>
              
              {/* Login Options - Minimalistic */}
              <div className="login-options-minimal">
                <p className="login-prompt">Access Your Account</p>
                <div className="login-buttons">
                  <button className="minimal-login-btn patient-btn" onClick={() => setLoginType('patient')}>
                    <User size={20} />
                    <span>Patient Login</span>
                  </button>
                  <button className="minimal-login-btn admin-btn" onClick={() => setLoginType('admin')}>
                    <UserCog size={20} />
                    <span>Admin Login</span>
                  </button>
                </div>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Expert Doctors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Patients</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Emergency Care</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Years Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Why Choose HealthCare Plus?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Heart size={32} />
              </div>
              <h3>Compassionate Care</h3>
              <p>Dedicated to providing personalized, patient-centered healthcare with empathy and respect.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Advanced Technology</h3>
              <p>Equipped with state-of-the-art medical equipment and latest diagnostic technology.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>24/7 Availability</h3>
              <p>Round-the-clock emergency services and medical assistance whenever you need it.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>Certified Professionals</h3>
              <p>Highly qualified and experienced medical professionals committed to excellence.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Activity size={32} />
                <span>HealthCare Plus</span>
              </div>
              <p>Committed to providing exceptional healthcare services with compassion and expertise.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#services">Our Services</a>
              <a href="#doctors">Our Doctors</a>
              <a href="#departments">Departments</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p><MapPin size={16} /> 123 Medical Center Dr, City, State 12345</p>
              <p><Phone size={16} /> (555) 123-4567</p>
              <p><Mail size={16} /> info@healthcareplus.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 HealthCare Plus. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Login Form (Patient or Admin)
  return (
    <div className="login-container">
      <div className="login-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="login-card">
        <button className="back-button" onClick={handleBack}>
          ← Back to Home
        </button>
        
        <div className="login-header">
          <div className={`logo-container ${loginType === 'patient' ? 'patient-theme' : 'admin-theme'}`}>
            {loginType === 'patient' ? <User size={48} /> : <UserCog size={48} />}
          </div>
          <h1 className="login-title">
            {loginType === 'patient' ? 'Patient Portal' : 'Admin Portal'}
          </h1>
          <p className="login-subtitle">
            {isRegistering 
              ? `Create your ${loginType === 'patient' ? 'patient' : 'admin'} account` 
              : `Sign in to ${loginType === 'patient' ? 'access your medical records' : 'manage hospital operations'}`
            }
          </p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              {loginType === 'admin' && (
                <>
                  <div className="form-group">
                    <label htmlFor="secret_key">Admin Secret Key</label>
                    <div className="input-wrapper">
                      <Lock size={20} className="input-icon" />
                      <input
                        type="text"
                        id="secret_key"
                        name="secret_key"
                        placeholder="Enter secret key "
                        value={formData.secret_key}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="qualification">Qualification (Optional)</label>
                    <div className="input-wrapper">
                      <Award size={20} className="input-icon" />
                      <input
                        type="text"
                        id="qualification"
                        name="qualification"
                        placeholder="e.g., MBBS, MD"
                        value={formData.qualification}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </>
              )}

              {loginType === 'patient' && (
                <div className="form-group">
                  <label htmlFor="contact">Contact Number</label>
                  <div className="input-wrapper">
                    <Phone size={20} className="input-icon" />
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      placeholder="+92-300-1234567"
                      value={formData.contact}
                      onChange={handleChange}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
              )}

              {loginType === 'admin' && (
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="admin@healthcare.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Login fields - show appropriate field based on user type */}
          {!isRegistering && loginType === 'patient' && (
            <div className="form-group">
              <label htmlFor="contact">Contact Number</label>
              <div className="input-wrapper">
                <Phone size={20} className="input-icon" />
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  placeholder="+92-300-1234567"
                  value={formData.contact}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          )}
          
          {!isRegistering && loginType === 'admin' && (
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@healthcare.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isRegistering && (
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
          )}

          <button 
            type="submit" 
            className={`login-button ${loginType === 'patient' ? 'patient-button' : 'admin-button'}`}
            disabled={loading}
          >
            {loading 
              ? (isRegistering ? 'Creating Account...' : 'Signing in...') 
              : (isRegistering ? 'Create Account' : 'Sign In')
            }
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <a 
              href="#" 
              className="register-link" 
              onClick={(e) => {
                e.preventDefault();
                setIsRegistering(!isRegistering);
                setError('');
              }}
            >
              {isRegistering ? 'Sign In' : 'Create Account'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
