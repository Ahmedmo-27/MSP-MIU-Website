import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

// Placeholder logo (text-based) – replace with actual image import when available
const Logo = () => (
  <div className="Navbar__logo" aria-label="MSP Tech Club Home">
    <span className="Navbar__logoMark">MSP</span>
    <span className="Navbar__logoText">Tech Club</span>
  </div>
);

const dropdownMotion = {
  hidden: { opacity: 0, y: -8, pointerEvents: 'none' },
  visible: { opacity: 1, y: 0, pointerEvents: 'auto', transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: 'easeIn' } }
};

const mobileMenuMotion = {
  closed: { opacity: 0, y: -16, transition: { duration: 0.25 } },
  open: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 0.8, 0.32, 1] } }
};

// Logical grouping of nav links into three dropdowns
const NAV_GROUPS = [
  {
    id: 'club',
    label: 'Club',
    items: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About Us' },
      { to: '/board', label: 'Meet the Board' },
      { to: '/vision', label: 'Our Vision' }
    ]
  },
  {
    id: 'members',
    label: 'Members',
    items: [
      { to: '/become-member', label: 'Become a Member' },
      { to: '/login', label: 'Login' },
      { to: '/leaderboard', label: 'Leaderboard' },
      { to: '/suggestions', label: 'Suggestions' }
    ]
  },
  {
    id: 'activities',
    label: 'Activities',
    items: [
      { to: '/exercises', label: 'Exercises' },
      { to: '/sessions', label: 'Sessions' },
      { to: '/events', label: 'Events' },
      { to: '/sponsors', label: 'Sponsors' }
    ]
  }
];

export const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('.Navbar')) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const toggleDropdown = (id) => {
    setOpenDropdown(prev => prev === id ? null : id);
  };

  const handleKey = (e, id) => {
    if (e.key === 'Escape') {
      setOpenDropdown(null);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown(id);
    }
  };

  return (
    <header className="Navbar" role="banner">
      <nav className="Navbar__inner" aria-label="Main navigation">
        <div className="Navbar__left">
          <a href="/" className="Navbar__brand" aria-label="Go to home">
            <Logo />
          </a>
        </div>
        <div className="Navbar__right">
          <button
            className={`Navbar__mobileToggle ${mobileOpen ? 'is-open' : ''}`}
            aria-expanded={mobileOpen}
            aria-controls="nav-menu"
            onClick={() => setMobileOpen(o => !o)}
          >
            <span className="Navbar__mobileBar" />
            <span className="Navbar__mobileBar" />
            <span className="Navbar__mobileBar" />
            <span className="sr-only">Menu</span>
          </button>
          <AnimatePresence>
            {(mobileOpen) && (
              <motion.div
                id="nav-menu"
                className="Navbar__menuWrapper"
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuMotion}
              >
                <ul className="Navbar__menu" role="menubar">
                  {NAV_GROUPS.map(group => (
                    <li key={group.id} className={`Navbar__group ${openDropdown === group.id ? 'is-open' : ''}`}>                      
                      <button
                        className="Navbar__trigger"
                        aria-haspopup="true"
                        aria-expanded={openDropdown === group.id}
                        onClick={() => toggleDropdown(group.id)}
                        onKeyDown={(e) => handleKey(e, group.id)}
                        type="button"
                      >
                        {group.label}
                        <span className="Navbar__chevron" aria-hidden="true" />
                      </button>
                      <AnimatePresence>
                        {openDropdown === group.id && (
                          <motion.ul
                            className="Navbar__dropdown"
                            role="menu"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={dropdownMotion}
                          >
                            {group.items.map(item => (
                              <li key={item.to} role="none">
                                <a role="menuitem" className="Navbar__link" href={item.to}>{item.label}</a>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Menu */}
          <ul className="Navbar__desktop" role="menubar">
            {NAV_GROUPS.map(group => (
              <li key={group.id} className={`Navbar__group ${openDropdown === group.id ? 'is-open' : ''}`}>                
                <button
                  className="Navbar__trigger"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === group.id}
                  onClick={() => toggleDropdown(group.id)}
                  onKeyDown={(e) => handleKey(e, group.id)}
                  type="button"
                >
                  {group.label}
                  <span className="Navbar__chevron" aria-hidden="true" />
                </button>
                <AnimatePresence>
                  {openDropdown === group.id && (
                    <motion.ul
                      className="Navbar__dropdown"
                      role="menu"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownMotion}
                    >
                      {group.items.map(item => (
                        <li key={item.to} role="none">
                          <a role="menuitem" className="Navbar__link" href={item.to}>{item.label}</a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
