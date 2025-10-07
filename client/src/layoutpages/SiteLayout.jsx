import React from 'react';
import { Navbar } from './Navbar/Navbar';
import { Footer } from './Footer/Footer';
import './SiteLayout.css';

export const SiteLayout = ({ children }) => {
  return (
    <div className="SiteLayout">
    
      <Navbar />
      <main className="SiteLayout__main" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
