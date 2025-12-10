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
  Users,
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

const Login = ({ setIsAuthenticated, setUserType }) => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    contact: '',
    secret_key: '',
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
      // -------------------------
      //  REGISTRATION SECTION
      // -------------------------
      if (isRegistering) {
        
        // Admin secret key check
        if (loginType === 'admin' && formData.secret_key !== '123$') {
          setError('Invalid admin secret key.');
          setLoading(false);
          return;
        }

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

        // Save session
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // If admin registering → do NOT auto-login
        if (loginType === 'admin') {
          setIsRegistering(false);
          setFormData({
            email: '',
            password: '',
            name: '',
            contact: '',
            secret_key: '',
            qualification: ''
          });
          alert('Doctor registered successfully! Please login.');
          setLoading(false);
          return;
        }

        // Patient auto-login
        setIsAuthenticated(true);
        setUserType('patient');
        navigate('/patient/dashboard');
        setLoading(false);
        return;
      }

      // -------------------------
      //  LOGIN SECTION
      // -------------------------
      const endpoint = loginType === 'admin'
        ? `${API_URL}/api/auth/login/doctor`
        : `${API_URL}/api/auth/login/patient`;

      const loginData = loginType === 'admin'
        ? { email: formData.email, password: formData.password }
        : { contact: formData.contact, password: formData.password };

      const response = await axios.post(endpoint, loginData);
      const { access_token, user } = response.data;

      // Save to localStorage first
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setIsAuthenticated(true);
      setUserType(user.type);

      // Navigate based on user type from response (more reliable than loginType)
      const dashboardPath = user.type === 'doctor' ? '/dashboard' : '/patient/dashboard';
      navigate(dashboardPath, { replace: true });

    } catch (err) {
      console.error('Login/Registration Error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response) {
        const errorDetail = err.response.data.detail || (isRegistering ? 'Registration failed' : 'Invalid credentials');
        setError(errorDetail);
        console.log('Setting error message:', errorDetail);
      } else if (err.request) {
        setError('Cannot connect to server. Backend is not running.');
      } else {
        setError('Unexpected error. Please try again.');
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

  // Landing screen
  if (loginType === null) {
    return (
      <div className="landing-container">
        {/* Enhanced Navigation */}
        <nav className="landing-nav">
          <div className="nav-logo">
            <div className="logo-icon">
              <Activity size={32} />
            </div>
            <span>HealthLane</span>
          </div>
          <div className="nav-links">
            <a href="#hero" className="nav-link" onClick={(e) => { e.preventDefault(); document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' }); }}>Home</a>
            <a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }); }}>Services</a>
            <a href="#footer" className="nav-link" onClick={(e) => { e.preventDefault(); document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' }); }}>About us</a>
            <div className="nav-divider"></div>
            <div className="nav-contact">
              <Phone size={16} />
              <span>(555) 123-4567</span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="landing-hero" id="hero">
          <div className="hero-background">
            <div className="hero-gradient"></div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
          
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <Heart size={16} />
                <span>Trusted Healthcare Provider</span>
              </div>
              
              <h1 className="hero-title">
                Your Health, <br />
                <span className="highlight">Our Priority</span>
              </h1>
              
              <p className="hero-description">
                Experience world-class healthcare with cutting-edge technology, 
                compassionate care, and dedicated medical professionals.
              </p>

              {/* Login Buttons */}
              <div className="login-options-hero">
                <button className="hero-login-btn patient-btn" onClick={() => setLoginType('patient')}>
                  <div className="btn-icon">
                    <User size={22} />
                  </div>
                  <div className="btn-content">
                    <span className="btn-title">Patient Portal</span>
                    <span className="btn-subtitle">Book appointments & view records</span>
                  </div>
                </button>
                
                <button className="hero-login-btn admin-btn" onClick={() => setLoginType('admin')}>
                  <div className="btn-icon">
                    <UserCog size={22} />
                  </div>
                  <div className="btn-content">
                    <span className="btn-title">Doctor Portal</span>
                    <span className="btn-subtitle">Manage patients & appointments</span>
                  </div>
                </button>
              </div>

              {/* Stats - Modern Inline Stats */}
              <div className="hero-stats-modern">
                <div className="stat-pill stat-pill-doctors">
                  <div className="stat-pill-icon">
                    <Award size={20} />
                  </div>
                  <div className="stat-pill-content">
                    <span className="stat-pill-number">50+</span>
                    <span className="stat-pill-label">Expert Doctors</span>
                  </div>
                </div>
                <div className="stat-pill stat-pill-patients">
                  <div className="stat-pill-icon">
                    <Users size={20} />
                  </div>
                  <div className="stat-pill-content">
                    <span className="stat-pill-number">10K+</span>
                    <span className="stat-pill-label">Happy Patients</span>
                  </div>
                </div>
                <div className="stat-pill stat-pill-emergency">
                  <div className="stat-pill-icon">
                    <Clock size={20} />
                  </div>
                  <div className="stat-pill-content">
                    <span className="stat-pill-number">24/7</span>
                    <span className="stat-pill-label">Emergency Care</span>
                  </div>
                </div>
                <div className="stat-pill stat-pill-trust">
                  <div className="stat-pill-icon">
                    <Shield size={20} />
                  </div>
                  <div className="stat-pill-content">
                    <span className="stat-pill-number">15+</span>
                    <span className="stat-pill-label">Years of Trust</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section" id="features">
          <div className="section-header">
            <h2 className="section-title">Why Choose HealthLane?</h2>
            <p className="section-subtitle">Comprehensive healthcare solutions tailored to your needs</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card-flip">
              <div className="feature-card-inner">
                <div className="feature-card-front">
                  <div className="feature-icon-large">
                    <Heart size={48} />
                  </div>
                  <h3>Compassionate Care</h3>
                  <p>Hover to learn more</p>
                </div>
                <div className="feature-card-back">
                  <h3>Compassionate Care</h3>
                  <p>Personalized medical attention with empathy and understanding for every patient. We treat you like family.</p>
                  <div className="feature-badge">Top Rated</div>
                </div>
              </div>
            </div>
            
            <div className="feature-card-flip">
              <div className="feature-card-inner">
                <div className="feature-card-front">
                  <div className="feature-icon-large">
                    <Shield size={48} />
                  </div>
                  <h3>Advanced Technology</h3>
                  <p>Hover to learn more</p>
                </div>
                <div className="feature-card-back">
                  <h3>Advanced Technology</h3>
                  <p>State-of-the-art medical equipment and cutting-edge treatment methods for accurate diagnosis.</p>
                  <div className="feature-badge">Modern</div>
                </div>
              </div>
            </div>
            
            <div className="feature-card-flip">
              <div className="feature-card-inner">
                <div className="feature-card-front">
                  <div className="feature-icon-large">
                    <Clock size={48} />
                  </div>
                  <h3>24/7 Availability</h3>
                  <p>Hover to learn more</p>
                </div>
                <div className="feature-card-back">
                  <h3>24/7 Availability</h3>
                  <p>Round-the-clock emergency services and medical support whenever you need. Always here for you.</p>
                  <div className="feature-badge">Always Open</div>
                </div>
              </div>
            </div>
            
            <div className="feature-card-flip">
              <div className="feature-card-inner">
                <div className="feature-card-front">
                  <div className="feature-icon-large">
                    <Award size={48} />
                  </div>
                  <h3>Expert Professionals</h3>
                  <p>Hover to learn more</p>
                </div>
                <div className="feature-card-back">
                  <h3>Expert Professionals</h3>
                  <p>Highly qualified doctors and medical staff with years of experience in their specialties.</p>
                  <div className="feature-badge">Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="landing-footer" id="footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Activity size={28} />
                <span>HealthLane</span>
              </div>
              <p>Providing exceptional healthcare services with compassion and excellence.</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#services">Services</a>
              <a href="#doctors">Our Doctors</a>
              <a href="#departments">Departments</a>
              <a href="#careers">Careers</a>
            </div>
            
            <div className="footer-section">
              <h4>Contact Us</h4>
              <div className="footer-contact">
                <MapPin size={16} />
                <span>123 Medical Street, Healthcare City</span>
              </div>
              <div className="footer-contact">
                <Phone size={16} />
                <span>(555) 123-4567</span>
              </div>
              <div className="footer-contact">
                <Mail size={16} />
                <span>info@healthcareplus.com</span>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 HealthLane. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // -----------------------------
  //     LOGIN / REGISTER FORM
  // -----------------------------
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
              : `Sign in to continue`
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

          {/* Registration Fields */}
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
                        placeholder="Enter secret key"
                        value={formData.secret_key}
                        onChange={handleChange}
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
                        placeholder="MBBS, MD"
                        value={formData.qualification}
                        onChange={handleChange}
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
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Login Inputs */}
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
                  required
                />
              </div>
            </div>
          )}

          {!isRegistering && loginType === 'admin' && (
            <div className="form-group">
              <label htmlFor="username">Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="username"
                  name="username"
                  placeholder="admin@healthcare.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  autoComplete="username"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
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
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
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
