import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import TextType from '../../../components/TextType/TextType';
import mspLogo from '../../../assets/Images/msp-logo.png';
import './HeroSection.css';

// Memoized animation variants to prevent recreation
const headingVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: .9, ease: 'easeOut' } }
};
const subVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: .85, ease: 'easeOut', delay: .15 } }
};
const ctaVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: .75, ease: 'easeOut', delay: .3, staggerChildren: .12 } }
};
const ctaItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: .65, ease: 'easeOut' } }
};

export const HeroSection = memo(() => {
  // Memoize text array to prevent recreation
  const heroTexts = useMemo(() => [
    "Empowering Future Tech Leaders",
    "Driving Innovation Through Technology",
    "Building a Connected Community"
  ], []);

  // Memoize animation props to prevent recreation
  const initialAnimation = useMemo(() => ({ opacity: 0, y: 20 }), []);
  const animateAnimation = useMemo(() => ({ opacity: 1, y: 0 }), []);
  const transitionAnimation = useMemo(() => ({ duration: 0.8, delay: 0.3 }), []);
  
  const hoverAnimation = useMemo(() => ({ scale: 1.06 }), []);
  const tapAnimation = useMemo(() => ({ scale: .94 }), []);
  const springTransition = useMemo(() => ({ type: 'spring', stiffness: 420, damping: 28 }), []);

  return (
    <section className="Hero" aria-labelledby="hero-heading">
      <div className="Hero__inner">
        <div className="Hero__col Hero__col--text">
          <motion.div
            initial={initialAnimation}
            animate={animateAnimation}
            transition={transitionAnimation}
          >
            <TextType
              text={heroTexts}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              className="Hero__title"
            />
          </motion.div>
          <motion.p className="Hero__subtitle" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.6 }} variants={subVariant}>
            MSP Tech Club is a community-driven hub fostering innovation, collaboration, and growth through technology, events, sessions, and real-world impact.
          </motion.p>
          <motion.div className="Hero__ctas" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.6 }} variants={ctaVariant}>
            <motion.a variants={ctaItem} href="/become-member" className="HeroCTA HeroCTA--primary" whileHover={hoverAnimation} whileTap={tapAnimation} transition={springTransition}>Become a Member</motion.a>
            <motion.a variants={ctaItem} href="/sessions" className="HeroCTA HeroCTA--ghost" whileHover={hoverAnimation} whileTap={tapAnimation} transition={springTransition}>Explore Sessions</motion.a>
          </motion.div>
        </div>
        <div className="Hero__col Hero__col--logo">
          <motion.div 
            className="Hero__logoWrap" 
            initial={{ opacity: 0, scale: .85 }} 
            whileInView={{ opacity: 1, scale: 1, transition: { duration: .9, ease: 'easeOut', delay: .25 } }} 
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div 
              className="Hero__logoContainer"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <img 
                src={mspLogo} 
                alt="MSP Tech Club Logo" 
                className="Hero__logo"
              />
            </motion.div>
            
            {/* Floating decorative elements */}
            <motion.div 
              className="Hero__float Hero__float--1"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0
              }}
            />
            <motion.div 
              className="Hero__float Hero__float--2"
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="Hero__float Hero__float--3"
              animate={{ 
                y: [0, -25, 0],
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            {/* Glowing background effect */}
            <div className="Hero__glow Hero__glow--logo" />
          </motion.div>
        </div>
      </div>
      <div className="Hero__bg" aria-hidden="true" />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
