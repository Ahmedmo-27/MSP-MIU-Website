import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

import mspLogo from '../../assets/Images/msp-logo.png';

const social = [
  { href: 'https://www.tiktok.com/@mspmiu', label: 'TikTok', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3.5c-.1 0-.2 0-.3.1-1.4.9-2.8 1.2-4.1 1.2v6.2c0 1.8-.7 3.4-2 4.6-1.1 1-2.6 1.6-4.2 1.6-3.3 0-6-2.7-6-6s2.7-6 6-6c.3 0 .6 0 .9.1v2.1c-.3-.1-.6-.1-.9-.1-2.2 0-4 1.8-4 4s1.8 4 4 4c1.1 0 2.1-.4 2.9-1.1 1-1 1.6-2.5 1.6-4.1V4.7c1.6 0 3.1-.4 4.6-1.3.1 0 .2-.1.2-.2.1-.1 0-.2-.1-.2z"/></svg>
  ) },
  { href: 'https://www.instagram.com/mspmiu', label: 'Instagram', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zM17.5 6.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/></svg>
  ) },
  { href: 'https://www.youtube.com', label: 'YouTube', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2s-.2-1.4-.8-2c-.8-.9-1.6-.9-2-1C15.9 4 12 4 12 4h0s-3.9 0-6.8.2c-.4.1-1.2.1-2 1-.6.6-.8 2-.8 2S2 8.8 2 10.5v1.1c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.8.9 1.9.9 2.4 1 1.8.2 7.6.2 7.6.2s3.9 0 6.8-.2c.4-.1 1.2-.1 2-1 .6-.6.8-2 .8-2s.2-1.7.2-3.3v-1.1c0-1.7-.2-3.3-.2-3.3zM10 14.7V8.9l5.2 2.9L10 14.7z"/></svg>
  ) }
];

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      className="Footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="Footer__grid">
        <section className="Footer__brand" aria-labelledby="footer-brand-heading">
          <motion.div style={{display: 'flex', alignItems: 'center', gap: '0.7rem'}} whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
            <motion.img
              src={mspLogo}
              alt="MSP Logo"
              className="Footer__logoImg"
              height={166}
              width={186}
              whileHover={{ filter: 'drop-shadow(0 0 10px rgba(3,169,244,.75)) brightness(1.1)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            />
            <motion.h2
              id="footer-brand-heading"
              className="Footer__logo"
              whileHover={{ textShadow: '0 0 14px rgba(3,169,244,.85)', scale: 1.02 }}
              transition={{ duration: .4 }}
            >MSP Tech Club</motion.h2>
          </motion.div>
          <p className="Footer__vision">Our Vision: <span>Empowering students through innovation, collaboration, and continuous learning.</span></p>
        </section>
        <section className="Footer__social" aria-labelledby="footer-social-heading">
          <h3 id="footer-social-heading" className="Footer__heading">Connect</h3>
          <ul className="Footer__socialList">
            {social.map(s => (
              <motion.li key={s.label} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 320, damping: 20 }}>
                <motion.a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="Footer__socialLink"
                  whileHover={{ background: 'rgba(255,255,255,0.14)', color: '#fff', boxShadow: '0 0 14px -2px rgba(3,169,244,.65), 0 0 32px -6px rgba(0,119,204,.55)' }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                >
                  <motion.span style={{display:'inline-flex'}} whileHover={{ rotate: 5 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>{s.icon}</motion.span>
                  <motion.span whileHover={{ letterSpacing: '1px' }} transition={{ duration: .45 }}>{s.label}</motion.span>
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </section>
        <section className="Footer__meta" aria-labelledby="footer-meta-heading">
          <h3 id="footer-meta-heading" className="Footer__heading">Info</h3>
          <p className="Footer__copy">&copy; {year} MSP Tech Club MIU. All rights reserved.</p>
        </section>
      </div>
    </motion.footer>
  );
};

export default Footer;
