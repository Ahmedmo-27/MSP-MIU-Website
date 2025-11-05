import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaUsers, FaUserPlus, FaSignInAlt, FaDumbbell, FaChalkboardTeacher, FaCalendarAlt, FaLightbulb, FaTrophy, FaHandshake
} from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import './Navbar.css';

import mspLogo from '../../assets/Images/msp-logo.png';

// Memoized links array to prevent recreation
const links = [
  { to: '/', label: 'Home', icon: <FaHome /> },
  { to: '/about', label: 'About Us', icon: <MdGroups /> },
  { to: '/board', label: 'Meet the Board', icon: <FaUsers /> },
  { to: '/become-member', label: 'Become a Member', icon: <FaUserPlus /> },
  { to: '/login', label: 'Login', icon: <FaSignInAlt /> },
  { to: '/exercises', label: 'Exercises', icon: <FaDumbbell /> },
  { to: '/sessions', label: 'Sessions', icon: <FaChalkboardTeacher /> },
  { to: '/events', label: 'Events', icon: <FaCalendarAlt /> },
  { to: '/suggestions', label: 'Suggestions', icon: <FaLightbulb /> },
  { to: '/leaderboard', label: 'Leaderboard', icon: <FaTrophy /> },
  { to: '/sponsors', label: 'Sponsors', icon: <FaHandshake /> }
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

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => { 
    document.body.style.overflow = mobileOpen ? 'hidden' : ''; 
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header className={`Navbar Navbar--flat ${scrolled ? 'Navbar--scrolled' : ''}`}>      
      <div className="Navbar__inner">
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 360, damping: 22 }}>
          <NavLink to="/" className="Navbar__brand" onClick={closeMobile} aria-label="MSP Home">
            <motion.img
              src={mspLogo}
              alt="MSP Logo"
              className="Navbar__logoImg"
              height={40}
              width={50}
              style={{ marginRight: '0.5rem' }}
              whileHover={{ filter: 'drop-shadow(0 0 6px rgba(3,169,244,.8)) brightness(1.15)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            />
            <motion.div className="Navbar__logoMark" layout whileHover={{ textShadow: '0 0 12px rgba(3,169,244,.9)' }} transition={{ duration: .35 }}>
              MSP
            </motion.div>
            <motion.div className="Navbar__logoText" whileHover={{ color: '#fff' }} transition={{ duration: .35 }}>Tech Club</motion.div>
          </NavLink>
        </motion.div>
        <motion.ul className="Navbar__links" variants={navMotion} initial="hidden" animate="visible">
          {links.map(l => (
            <motion.li key={l.to} variants={itemMotion} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 26 }}>
              <NavLink
                to={l.to}
                onClick={closeMobile}
                className={({ isActive }) => `NavItem ${isActive ? 'is-active' : ''}`}
              >
                <motion.span className="NavItem__icon" whileHover={{ scale: 1.15 }} transition={{ type: 'spring', stiffness: 380, damping: 20 }}>
                  {l.icon}
                </motion.span>
                <motion.span className="NavItem__label" whileHover={{ color: '#ffffff' }} transition={{ duration: .35 }}>{l.label}</motion.span>
                <motion.span
                  className="NavItem__underline"
                  layoutId={`nav-underline-${l.to}`}
                  initial={false}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: .4, ease: 'easeOut' }}
                />
              </NavLink>
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
              <motion.div
                aria-label="Mobile navigation"
                role="navigation"
                className="NavDrawer"
                initial={{ x: '100%' }}
                animate={{ x: 0, transition: { duration: 0.45, ease: 'easeOut' } }}
                exit={{ x: '100%', transition: { duration: 0.35, ease: 'easeIn' } }}
              >
                <ul className="NavDrawer__list">
                  {links.map(l => (
                    <motion.li key={l.to} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 340, damping: 26 }}>
                      <NavLink
                        to={l.to}
                        onClick={closeMobile}
                        className={({ isActive }) => `NavDrawer__link ${isActive ? 'is-active' : ''}`}
                      >
                        <motion.span className="NavDrawer__icon" whileHover={{ scale: 1.2, rotate: 3 }} transition={{ type: 'spring', stiffness: 360, damping: 18 }}>{l.icon}</motion.span>
                        <motion.span className="NavDrawer__label" whileHover={{ color: '#fff' }} transition={{ duration: .3 }}>{l.label}</motion.span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.button
                type="button"
                aria-label="Close menu"
                className="NavOverlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                onClick={closeMobile}
              />
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
});

Navbar.displayName = 'Navbar';

export { Navbar };
export default Navbar;
