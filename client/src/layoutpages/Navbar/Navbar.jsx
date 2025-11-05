import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaUsers, FaUserPlus, FaSignInAlt, FaDumbbell, FaChalkboardTeacher, FaCalendarAlt, FaLightbulb, FaTrophy, FaHandshake
} from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import './Navbar.css';
import LoginCard from '../../components/LoginCard';

import mspLogo from '../../assets/Images/msp-logo.png';

// Memoized links array to prevent recreation
const links = [
  { to: '/', label: 'Home', icon: <FaHome /> },
  { to: '/about', label: 'About Us', icon: <MdGroups /> },
  // { to: '/board', label: 'Meet the Board', icon: <FaUsers /> },
  // { to: '/become-member', label: 'Become a Member', icon: <FaUserPlus /> },
  { to: '/login', label: 'Login', icon: <FaSignInAlt /> },
  // // { to: '/exercises', label: 'Exercises', icon: <FaDumbbell /> },
  // { to: '/sessions', label: 'Sessions', icon: <FaChalkboardTeacher /> },
  { to: '/events', label: 'Events', icon: <FaCalendarAlt /> },
  // { to: '/suggestions', label: 'Suggestions', icon: <FaLightbulb /> },
  // { to: '/leaderboard', label: 'Leaderboard', icon: <FaTrophy /> },
  // { to: '/sponsors', label: 'Sponsors', icon: <FaHandshake /> }
];

// Memoized animation variants
const navMotion = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', staggerChildren: 0.035 } }
};
const itemMotion = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

const Navbar = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);

  // Memoized scroll handler

  useEffect(() => { 
    document.body.style.overflow = mobileOpen ? 'hidden' : ''; 
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  
  // Handle login button click - show login overlay
  const handleLoginClick = useCallback((e) => {
    e.preventDefault();
    setShowLoginCard(true);
    setMobileOpen(false); // Close mobile menu if open
  }, []);
  
  const closeLoginCard = useCallback(() => setShowLoginCard(false), []);

  return (
    <header className={`Navbar Navbar--flat ${scrolled ? 'Navbar--scrolled' : ''}`}>      
      <div className="Navbar__inner">
        <motion.div whileHover={{ scale: 1.06 }}>
          <NavLink to="/" className="Navbar__brand" onClick={closeMobile} aria-label="MSP Home">
            <motion.img
              src={mspLogo}
              alt="MSP Logo"
              className="Navbar__logoImg"
              height={40}
              width={50}
            />
            <motion.div className="Navbar__logoMark">
              MSP
            </motion.div>
            <motion.div className="Navbar__logoText">Tech Club</motion.div>
          </NavLink>
        </motion.div>
        <motion.ul className="Navbar__links" variants={navMotion} initial="hidden" animate="visible">
          {links.map(l => (
            <motion.li key={l.to} variants={itemMotion} whileHover={{ y: -2 }}>
              {l.to === '/login' ? (
                <button
                  onClick={handleLoginClick}
                  className="NavItem login-nav-button"
                >
                  <motion.span className="NavItem__icon" whileHover={{ scale: 1.15 }}>
                    {l.icon}
                  </motion.span>
                  <motion.span className="NavItem__label" whileHover={{ color: '#ffffff' }}>{l.label}</motion.span>
                  <motion.span
                    className="NavItem__underline"
                    layoutId={`nav-underline-${l.to}`}
                    initial={false}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                  />
                </button>
              ) : (
                <NavLink
                  to={l.to}
                  onClick={closeMobile}
                  className={({ isActive }) => `NavItem ${isActive ? 'is-active' : ''}`}
                >
                  <motion.span className="NavItem__icon" whileHover={{ scale: 1.15 }}>
                    {l.icon}
                  </motion.span>
                  <motion.span className="NavItem__label" whileHover={{ color: '#ffffff' }}>{l.label}</motion.span>
                  <motion.span
                    className="NavItem__underline"
                    layoutId={`nav-underline-${l.to}`}
                    initial={false}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                  />
                </NavLink>
              )}
            </motion.li>
          ))}
        </motion.ul>
        <button className={`NavHamburger ${mobileOpen ? 'is-open' : ''}`} aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(o => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>
      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop Overlay - positioned first so it appears behind the drawer */}
              <motion.div
                className="NavOverlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobile}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1500,
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label="Close menu"
              />
              
              {/* Mobile Navigation Drawer - positioned above the overlay */}
              <motion.div
                aria-label="Mobile navigation"
                role="navigation"
                className="NavDrawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                style={{ zIndex: 2000 }}
              >
                <ul className="NavDrawer__list">
                  {links.map(l => (
                    <motion.li key={l.to} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 340, damping: 26 }}>
                      {l.to === '/login' ? (
                        <button
                          onClick={(e) => {
                            handleLoginClick(e);
                            closeMobile();
                          }}
                          className="NavDrawer__link login-nav-button"
                        >
                          <motion.span className="NavDrawer__icon" whileHover={{ scale: 1.2, rotate: 3 }} transition={{ type: 'spring', stiffness: 360, damping: 18 }}>{l.icon}</motion.span>
                          <motion.span className="NavDrawer__label" whileHover={{ color: '#fff' }} transition={{ duration: .3 }}>{l.label}</motion.span>
                        </button>
                      ) : (
                        <NavLink
                          to={l.to}
                          onClick={closeMobile}
                          className={({ isActive }) => `NavDrawer__link ${isActive ? 'is-active' : ''}`}
                        >
                          <motion.span className="NavDrawer__icon" whileHover={{ scale: 1.2, rotate: 3 }} transition={{ type: 'spring', stiffness: 360, damping: 18 }}>{l.icon}</motion.span>
                          <motion.span className="NavDrawer__label" whileHover={{ color: '#fff' }} transition={{ duration: .3 }}>{l.label}</motion.span>
                        </NavLink>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
      
      {/* Login Card Overlay */}
      <LoginCard isOpen={showLoginCard} onClose={closeLoginCard} />
    </header>
  );
});

Navbar.displayName = 'Navbar';

export { Navbar };
export default Navbar;
