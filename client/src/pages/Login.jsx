import React from 'react';
import './PageBase.css';

export const Login = () => {
  return (
    <section className="PageBase">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center',
        color: '#eaf2ff'
      }}>
        <h1>Login</h1>
        <p>Please use the login button in the navigation bar to access your account.</p>
      </div>
    </section>
  );
};

export default Login;