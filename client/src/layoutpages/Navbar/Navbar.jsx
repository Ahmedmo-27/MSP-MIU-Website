import { useState, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaSignInAlt, FaCalendarAlt } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import './Navbar.css';
import LoginCard from '../../components/LoginCard';
import mspLogo from '../../assets/Images/msp-logo.png';

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

const Navbar = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const location = useLocation();

  useEffect(() => { 
    document.body.style.overflow = mobileOpen ? 'hidden' : ''; 
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  
  const handleLoginClick = useCallback((e) => {
    e.preventDefault();
    setShowLoginCard(true);
    closeMobile();
  }, [closeMobile]);
  
  const closeLoginCard = useCallback(() => setShowLoginCard(false), []);

  return (
    <header className={`Navbar ${scrolled ? 'Navbar--scrolled' : ''}`}>      
      <div className="Navbar__inner">
        <NavLink to="/" className="Navbar__brand" onClick={closeMobile} aria-label="MSP Home">
          <img
            src={mspLogo}
            alt="MSP Logo"
            height={40}
            width={50}
          />
          <div className="Navbar__logoMark">MSP</div>
          <div className="Navbar__logoText">Tech Club</div>
        </NavLink>
        <ul className="Navbar__links">
          {links.map(l => (
            <li key={l.to}>
              {l.to === '/login' ? (
                <button
                  onClick={handleLoginClick}
                  className="NavItem login-nav-button"
                >
                  <span className="NavItem__icon">{l.icon}</span>
                  <span className="NavItem__label">{l.label}</span>
                </button>
              ) : (
                <NavLink
                  to={l.to}
                  onClick={closeMobile}
                  className={({ isActive }) => `NavItem ${isActive ? 'is-active' : ''}`}
                >
                  <span className="NavItem__icon">{l.icon}</span>
                  <span className="NavItem__label">{l.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        <button 
          className={`NavHamburger ${mobileOpen ? 'is-open' : ''}`} 
          aria-label="Menu" 
          aria-expanded={mobileOpen} 
          onClick={() => setMobileOpen(o => !o)}
        >
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
                className="NavOverlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobile}
                aria-label="Close menu"
              />
              <motion.div
                aria-label="Mobile navigation"
                role="navigation"
                className="NavDrawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ul className="NavDrawer__list">
                  {links.map(l => (
                    <li key={l.to}>
                      {l.to === '/login' ? (
                        <button
                          onClick={(e) => {
                            handleLoginClick(e);
                            closeMobile();
                          }}
                          className="NavDrawer__link"
                        >
                          <span className="NavDrawer__icon">{l.icon}</span>
                          <span className="NavDrawer__label">{l.label}</span>
                        </button>
                      ) : (
                        <NavLink
                          to={l.to}
                          onClick={closeMobile}
                          className={({ isActive }) => `NavDrawer__link ${isActive ? 'is-active' : ''}`}
                        >
                          <span className="NavDrawer__icon">{l.icon}</span>
                          <span className="NavDrawer__label">{l.label}</span>
                        </NavLink>
                      )}
                    </li>
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
