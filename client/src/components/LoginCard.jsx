import { useState, useCallback, memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import ApiService from '../services/api';
import './LoginCard.css';

const LoginCard = memo(({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ university_id: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Format university_id input (xxxx/xxxxx)
    if (name === 'university_id') {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
      
      // Format as xxxx/xxxxx
      if (digitsOnly.length <= 4) {
        processedValue = digitsOnly;
      } else if (digitsOnly.length <= 9) {
        processedValue = `${digitsOnly.slice(0, 4)}/${digitsOnly.slice(4)}`;
      } else {
        // Limit to 10 digits total (4 + 5)
        processedValue = `${digitsOnly.slice(0, 4)}/${digitsOnly.slice(4, 9)}`;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
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
    
    if (!formData.university_id) {
      newErrors.university_id = 'University ID is required';
    } else if (!/^\d{4}\/\d{5}$/.test(formData.university_id)) {
      newErrors.university_id = 'Format: xxxx/xxxxx (e.g. 20xx/12345)';
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
      const result = await ApiService.login(formData.university_id, formData.password);
      setFormData({ university_id: '', password: '' });
      setErrors({});
      onClose();
      if (result.user) {
        const displayName = result.user.full_name || result.user.university_id || 'User';
        alert(`Welcome back, ${displayName}!`);
        window.location.href = '/profile';
      } else {
        alert('Login successful!');
      }
    } catch (error) {
      const msg = error.message || '';
      if (msg.includes('Invalid credentials') || msg.includes('Unauthorized')) {
        setErrors({ university_id: 'Invalid university ID or password' });
      } else if (msg.includes('User not found') || msg.includes('not found')) {
        setErrors({ university_id: 'No account found with this university ID' });
      } else if (msg.includes('Invalid university ID format')) {
        setErrors({ university_id: 'Format: xxxx/xxxxx (e.g. 20xx/12345)' });
      } else if (msg.includes('Network') || msg.includes('fetch')) {
        setErrors({ university_id: 'Network error. Please check your connection.' });
      } else {
        setErrors({ university_id: msg || 'Login failed. Please try again.' });
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
              <label htmlFor="university_id" className="input-label">University ID</label>
              <input
                type="text"
                id="university_id"
                name="university_id"
                value={formData.university_id}
                onChange={handleInputChange}
                placeholder="20xx/12345"
                className={`login-input ${errors.university_id ? 'error' : ''}`}
                required
                autoComplete="username"
              />
              {errors.university_id && <span className="error-message">{errors.university_id}</span>}
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
