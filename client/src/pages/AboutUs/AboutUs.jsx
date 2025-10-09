import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import './AboutUs.css';
import { FiTarget, FiEye, FiHeart, FiUsers, FiCpu, FiArrowRight } from 'react-icons/fi';
import { FaMicrosoft, FaRocket, FaTrophy, FaCode, FaHandshake, FaUserPlus } from 'react-icons/fa';
import { MdLightbulbOutline, MdStar } from 'react-icons/md';

// Memoized animation variants
const heroParent = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const cardWhileHover = { scale: 1.045, boxShadow: '0 10px 40px -10px rgba(0,0,0,.7), 0 0 0 1px rgba(0,160,255,.35)' };

// Memoized data arrays
const missionValues = [
  {
    id: 'm1',
    title: 'Mission',
    icon: <FiTarget />,
    body: 'To inspire and equip students with the knowledge, tools, and opportunities to innovate and make an impact through technology.'
  },
  {
    id: 'm2',
    title: 'Vision',
    icon: <FiEye />,
    body: 'A thriving community of future tech leaders driving digital transformation through creativity, collaboration, and continuous learning.'
  },
  {
    id: 'm3',
    title: 'Values',
    icon: <FiHeart />,
    body: 'Innovation · Growth · Collaboration · Inclusion · Excellence'
  }
];

const milestones = [
  { id: 't1', year: '2018', title: 'Club Founded', icon: <FaMicrosoft />, body: 'MSP Tech Club launched at MIU aligning with the Microsoft Learn Student Ambassadors program.' },
  { id: 't2', year: '2019', title: 'First Tech Week', icon: <FaTrophy />, body: 'Organized our inaugural multi-day Tech Week featuring talks, demos, and peer learning sessions.' },
  { id: 't3', year: '2020', title: 'Virtual Shift', icon: <FaHandshake />, body: 'Pivoted to remote meetups & workshops, expanding reach and onboarding new members worldwide.' },
  { id: 't4', year: '2021', title: 'Community Growth', icon: <FiUsers />, body: 'Rapid membership growth with mentoring pods and cross-discipline collaboration tracks.' },
  { id: 't5', year: '2022', title: 'Hackathon Series', icon: <FaCode />, body: 'Hosted themed hackathons focused on sustainability, AI literacy, and campus innovation.' },
  { id: 't6', year: '2023', title: 'Launch Labs', icon: <MdLightbulbOutline />, body: 'Introduced project incubator cohorts pairing juniors with peer leads & alumni guidance.' },
  { id: 't7', year: '2024', title: 'Innovation Acceleration', icon: <FaRocket />, body: 'Scaled partner collaborations, deepened Azure adoption, and showcased student solutions.' }
];

const AboutUs = memo(() => {
  return (
    <main className="About">
      <section className="AboutHero" aria-labelledby="about-hero-heading">
        <div className="AboutHero__bg" aria-hidden="true" />
        <motion.div className="AboutHero__inner" variants={heroParent} initial="hidden" animate="show">
          <motion.h1 variants={fadeUp} id="about-hero-heading" className="AboutHero__title">About MSP Tech Club</motion.h1>
          <motion.p variants={fadeUp} className="AboutHero__subtitle">MSP Tech Club is a student-led innovation community powered by the Microsoft Learn Student Ambassadors program. We explore cutting‑edge technologies, build real projects, and develop technical & leadership excellence together.</motion.p>
        </motion.div>
      </section>


      <section className="AboutTriad" aria-label="Mission Vision Values">
        <div className="AboutTriad__grid">
          {missionValues.map(item => (
            <motion.article key={item.id} className="TriadCard" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.75, ease: 'easeOut' }} whileHover={cardWhileHover}>
              <motion.div className="TriadCard__icon" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
                {item.icon}
              </motion.div>
              <h3 className="TriadCard__title">{item.title}</h3>
              <p className="TriadCard__body">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="AboutMeaning" aria-labelledby="about-meaning-heading">
        <div className="AboutMeaning__accent" aria-hidden="true" />
        <header className="AboutMeaning__head">
          <h2 id="about-meaning-heading" className="AboutMeaning__title">What MSP Stands For</h2>
        </header>
        <motion.div className="AboutMeaning__content" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <p className="AboutMeaning__text">MSP stands for <span className="hi">Microsoft Learn Student Ambassadors</span> — a global program connecting passionate student technologists with resources, mentorship, and pathways to impact. At MIU, our MSP Tech Club activates this mission through hands‑on sessions, workshops, hackathons, peer mentoring, and community solution building.</p>
          <p className="AboutMeaning__text">We focus on practical exploration across cloud, AI, developer tooling, productivity, and emerging experiences. Members grow by <span className="hi">learning</span>, <span className="hi">building</span>, <span className="hi">sharing</span>, and <span className="hi">leading</span>.</p>
          <ul className="AboutMeaning__iconList" aria-label="Focus Areas">
            <motion.li whileHover={{ scale: 1.08 }}><FaMicrosoft /> Program Alignment</motion.li>
            <motion.li whileHover={{ scale: 1.08 }}><FiCpu /> Emerging Tech Labs</motion.li>
            <motion.li whileHover={{ scale: 1.08 }}><FiUsers /> Community & Mentorship</motion.li>
            <motion.li whileHover={{ scale: 1.08 }}><MdStar /> Excellence & Impact</motion.li>
          </ul>
        </motion.div>
      </section>

      <section className="AboutTimeline" aria-labelledby="about-timeline-heading">
        <header className="AboutTimeline__head">
          <h2 id="about-timeline-heading" className="AboutTimeline__title">MSP-MIU Milestones</h2>
        </header>
        <div className="Timeline" role="list">
          {milestones.map((m, idx) => (
            <motion.div role="listitem" key={m.id} className={`TimelineItem ${idx % 2 ? 'TimelineItem--right' : 'TimelineItem--left'}`} initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.85, ease: 'easeOut' }}>
              <div className="TimelineItem__dot" />
              <motion.div className="TimelineItem__iconWrap" whileHover={{ scale: 1.15, rotate: 8 }}>
                {m.icon}
              </motion.div>
              <div className="TimelineItem__card">
                <div className="TimelineItem__year">{m.year}</div>
                <h3 className="TimelineItem__heading">{m.title}</h3>
                <p className="TimelineItem__body">{m.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="AboutCTA" aria-labelledby="about-cta-heading">
        <div className="AboutCTA__glow" aria-hidden="true" />
        <header className="AboutCTA__head">
          <h2 id="about-cta-heading" className="AboutCTA__title">Join & Explore</h2>
          <p className="AboutCTA__subtitle">Ready to build, learn, and lead? Connect with mentors, ship projects, and amplify your impact inside a supportive tech community.</p>
        </header>
        <div className="AboutCTA__actions">
          <motion.a whileHover={{ scale: 1.08, boxShadow: '0 8px 30px -8px rgba(0,160,255,.55)' }} whileTap={{ scale: 0.94 }} href="#" className="Btn Btn--primary"><FaUserPlus className="Btn__icon" />Become a Member</motion.a>
          <motion.a whileHover={{ scale: 1.08, boxShadow: '0 8px 30px -8px rgba(0,160,255,.55)' }} whileTap={{ scale: 0.94 }} href="#" className="Btn Btn--outline">Explore Events<FiArrowRight className="Btn__icon Btn__icon--trail" /></motion.a>
        </div>
      </section>
    </main>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;