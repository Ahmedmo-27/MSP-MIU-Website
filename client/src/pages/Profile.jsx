import React, { useState, useEffect } from 'react';
import './PageBase.css';
import ApiService from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    ApiService.getProfile().then((user) => {
      setUser(user);
    }).catch((error) => {
      console.error('Error fetching profile:', error);
    });
  }, []);
  const handleLogout = () => {
    ApiService.logout().then(() => {
      window.location.href = '/home';
    });
  };
  return (
    <section className="PageBase">
      <div className="profile-container">
        <h1>Profile</h1>
        <p>Welcome to your profile page, {user?.full_name || 'User'}.</p>
        <p>University ID: {user?.university_id || 'N/A'}</p>
        <p>Full Name: {user?.full_name || 'N/A'}</p>
        <p>Email: {user?.email || 'N/A'}</p>
        <p>Department: {user?.department_id || 'N/A'}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </section>
  );
};

export default Profile;