import { useState, useCallback, memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import ApiService from '../services/api';
import './LoginCard.css';

const LoginCard = memo(({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback(() => setShowPassword(prev => !prev), []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Basic validation
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await ApiService.login(formData.email, formData.password);
      setFormData({ email: '', password: '' });
      setErrors({});
      onClose();
      if (result.user) {
        alert(`Welcome back, ${result.user.name || result.user.email}!`);
        window.location.href = '/registeration-admin';
      } else {
        alert('Login successful!');
      }
    } catch (error) {
      const msg = error.message || '';
      if (msg.includes('Invalid credentials') || msg.includes('Unauthorized')) {
        setErrors({ email: 'Invalid email or password' });
      } else if (msg.includes('User not found')) {
        setErrors({ email: 'No account found with this email' });
      } else if (msg.includes('Network') || msg.includes('fetch')) {
        setErrors({ email: 'Network error. Please check your connection.' });
      } else {
        setErrors({ email: msg || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }, [formData, onClose]);

  const handleForgotPassword = useCallback(() => {
    alert('Forgot password functionality will be implemented here');
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="login-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="login-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="login-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>

          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your MSP account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`login-input ${errors.email ? 'error' : ''}`}
                required
                autoComplete="email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`login-input password-input ${errors.password ? 'error' : ''}`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="login-options">
              <button type="button" className="forgot-password-btn" onClick={handleForgotPassword}>
                Forgot Password?
              </button>
            </div>

            <motion.button
              type="submit"
              className={`login-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});

LoginCard.displayName = 'LoginCard';

export default LoginCard;
