import React, { useState, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import ApiService from '../services/api';
import './LoginCard.css';

const LoginCard = memo(({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

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
      console.log('Login attempt:', formData);
      
      // Call the API service to authenticate
      const result = await ApiService.login(formData.email, formData.password);
      
      console.log('Login successful:', result);
      
      // Reset form
      setFormData({ email: '', password: '' });
      setErrors({});
      
      // Close the login modal
      onClose();
      
      // Redirect to admin dashboard or show success message
      if (result.user) {
        alert(`Welcome back, ${result.user.name || result.user.email}!`);
        // Optionally redirect to admin dashboard
        window.location.href = '/registeration-admin';
      } else {
        alert('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Set specific error messages based on the error
      if (error.message.includes('Invalid credentials') || error.message.includes('Unauthorized')) {
        setErrors({ email: 'Invalid email or password' });
      } else if (error.message.includes('User not found')) {
        setErrors({ email: 'No account found with this email' });
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        setErrors({ email: 'Network error. Please check your connection.' });
      } else {
        setErrors({ email: error.message || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }, [formData, onClose]);

  const handleForgotPassword = useCallback(() => {
    alert('Forgot password functionality will be implemented here');
  }, []);


  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
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
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(74,166,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(30,198,255,0.08) 0%, transparent 50%),
            linear-gradient(135deg, rgba(9, 26, 44, 0.85) 0%, rgba(19, 59, 90, 0.85) 100%)
          `,
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          minHeight: '100vh',
          width: '100vw',
          overflow: 'hidden'
        }}
        aria-label="Close login"
      >
        <motion.div
          className="login-card"
          initial={{ 
            scale: 0.7, 
            opacity: 0, 
            y: 100,
            rotateX: -15
          }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            rotateX: 0
          }}
          exit={{ 
            scale: 0.7, 
            opacity: 0, 
            y: 100,
            rotateX: 15
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 35,
            mass: 0.8
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            maxWidth: '420px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            zIndex: 10000
          }}
        >
          {/* Close Button */}
          <button
            className="login-close-btn"
            onClick={onClose}
            aria-label="Close login"
          >
            <FaTimes />
          </button>

          {/* Header */}
          <motion.div 
            className="login-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your MSP account</p>
          </motion.div>

          {/* Form */}
          <motion.form 
            className="login-form" 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Forgot Password */}
            <motion.div 
              className="login-options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <button
                type="button"
                className="forgot-password-btn"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`login-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 15px 35px rgba(13, 123, 216, 0.4)"
              }}
              whileTap={{ 
                scale: 0.98,
                boxShadow: "0 5px 15px rgba(13, 123, 216, 0.3)"
              }}
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

          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});

LoginCard.displayName = 'LoginCard';

export default LoginCard;
