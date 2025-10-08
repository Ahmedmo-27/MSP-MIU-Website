import React from 'react';
import { motion } from 'framer-motion';
import './AboutUs.css';

const heroParent = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const cardWhileHover = { scale: 1.045, boxShadow: '0 10px 40px -10px rgba(0,0,0,.7), 0 0 0 1px rgba(0,160,255,.35)' };

const missionValues = [
  { id: 'm1', title: 'Mission', body: 'Placeholder mission statement text goes here. It will describe the core purpose and goals.' },
  { id: 'm2', title: 'Vision', body: 'Placeholder vision text. This will outline the aspirational future impact and direction.' },
  { id: 'm3', title: 'Values', body: 'Placeholder values text, summarizing guiding principles and culture keywords.' }
];

const milestones = [
  { id: 't1', year: '2018', title: 'Founded', body: 'Placeholder founding milestone summary.' },
  { id: 't2', year: '2019', title: 'First Annual Tech Week', body: 'Placeholder for early flagship event milestone.' },
  { id: 't3', year: '2021', title: 'Community Growth', body: 'Placeholder growth milestone details.' },
  { id: 't4', year: '2022', title: 'Hackathon', body: 'Placeholder hackathon milestone description.' },
  { id: 't5', year: '2024', title: 'Innovation Push', body: 'Placeholder innovation milestone summary.' }
];

const AboutUs = () => {
  return (
    <main className="About">
      <section className="AboutHero" aria-labelledby="about-hero-heading">
        <div className="AboutHero__bg" aria-hidden="true" />
        <motion.div className="AboutHero__inner" variants={heroParent} initial="hidden" animate="show">
          <motion.h1 variants={fadeUp} id="about-hero-heading" className="AboutHero__title">About MSP Tech Club</motion.h1>
          <motion.p variants={fadeUp} className="AboutHero__subtitle">Placeholder introductory text that briefly explains the club purpose, focus areas, and energy.</motion.p>
        </motion.div>
      </section>

      <section className="AboutTriad" aria-label="Mission Vision Values">
        <div className="AboutTriad__grid">
          {missionValues.map(item => (
            <motion.article key={item.id} className="TriadCard" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.75, ease: 'easeOut' }} whileHover={cardWhileHover}>
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
          <p className="AboutMeaning__text">Placeholder descriptive copy about the broader program context & local impact. Highlight <span className="hi">learning</span>, <span className="hi">innovation</span>, and <span className="hi">community</span> as key pillars with interactive emphasis placeholders. More placeholder narrative lines for future editing.</p>
        </motion.div>
      </section>

      <section className="AboutTimeline" aria-labelledby="about-timeline-heading">
        <header className="AboutTimeline__head">
          <h2 id="about-timeline-heading" className="AboutTimeline__title">MSP-MIU Milestones</h2>
        </header>
        <div className="Timeline" role="list">
          {milestones.map((m, idx) => (
            <motion.div role="listitem" key={m.id} className={`TimelineItem ${idx % 2 ? 'TimelineItem--right' : 'TimelineItem--left'}`} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="TimelineItem__dot" />
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
          <p className="AboutCTA__subtitle">Placeholder closing statement encouraging deeper involvement, upcoming events, and collaborative energy.</p>
        </header>
        <div className="AboutCTA__actions">
          <motion.a whileHover={{ scale: 1.07, boxShadow: '0 8px 30px -8px rgba(0,160,255,.55)' }} whileTap={{ scale: 0.95 }} href="#" className="Btn Btn--primary">Become a Member</motion.a>
          <motion.a whileHover={{ scale: 1.07, boxShadow: '0 8px 30px -8px rgba(0,160,255,.55)' }} whileTap={{ scale: 0.95 }} href="#" className="Btn Btn--outline">Explore Events</motion.a>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;