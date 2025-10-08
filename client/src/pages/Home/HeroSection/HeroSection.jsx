import React from 'react';
import { motion } from 'framer-motion';
import TextType from '../../../components/TextType/TextType';
import './HeroSection.css';

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

export const HeroSection = () => {
  return (
    <section className="Hero" aria-labelledby="hero-heading">
      <div className="Hero__inner">
        <div className="Hero__col Hero__col--text">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <TextType
              text={[
                "Empowering Future Tech Leaders",
                "Driving Innovation Through Technology",
                "Building a Connected Community"
              ]}
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
            <motion.a variants={ctaItem} href="/become-member" className="HeroCTA HeroCTA--primary" whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }}>Become a Member</motion.a>
            <motion.a variants={ctaItem} href="/sessions" className="HeroCTA HeroCTA--ghost" whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }}>Explore Sessions</motion.a>
          </motion.div>
        </div>
        <div className="Hero__col Hero__col--model">
          <motion.div className="Hero__modelWrap" initial={{ opacity: 0, scale: .85 }} whileInView={{ opacity: 1, scale: 1, transition: { duration: .9, ease: 'easeOut', delay: .25 } }} viewport={{ once: true, amount: 0.4 }}>
            <model-viewer 
              src="/src/assets/models3d/robotmsp2.glb" 
              alt="MSP 3D Logo Model"
              auto-rotate
              camera-controls
              shadow-intensity="1"
              exposure="1"
              loading="lazy"
              class="Hero__model"
            ></model-viewer>
            <div className="Hero__glow" />
          </motion.div>
        </div>
      </div>
      <div className="Hero__bg" aria-hidden="true" />
    </section>
  );
};

export default HeroSection;
