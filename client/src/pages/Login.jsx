import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCard from '../components/LoginCard';
import ApiService from '../services/api';
import './PageBase.css';

export const Login = () => {
  const [showLoginCard, setShowLoginCard] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-open login card when component mounts
    setShowLoginCard(true);
  }, []);

  const handleClose = () => {
    setShowLoginCard(false);
    // Check if user is authenticated after a brief delay
    // If login was successful, LoginCard will redirect to /profile
    // If user just closed the card, navigate to home
    setTimeout(() => {
      if (!ApiService.isAuthenticated()) {
        navigate('/');
      }
    }, 100);
  };

  return (
    <section className="PageBase">
      <LoginCard isOpen={showLoginCard} onClose={handleClose} />
    </section>
  );
};

export default Login;