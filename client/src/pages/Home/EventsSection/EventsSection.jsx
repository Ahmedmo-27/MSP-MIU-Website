import React from 'react';
import { motion } from 'framer-motion';
import CurvedLoop from '../../../components/CurvedLoop/CurvedLoop';
import './EventsSection.css';

const mockEvents = [
  { id: 'e1', title: 'Intro to Azure', date: 'Oct 15, 2025', time: '5:00 PM', img: '', action: 'Join' },
  { id: 'e2', title: 'AI Study Jam', date: 'Oct 18, 2025', time: '4:00 PM', img: '', action: 'Join' },
  { id: 'e3', title: 'Hackathon Kickoff', date: 'Oct 25, 2025', time: '10:00 AM', img: '', action: 'Details' },
  { id: 'e4', title: 'UI/UX Sprint', date: 'Oct 28, 2025', time: '2:00 PM', img: '', action: 'Join' }
];

const EventsSection = () => {
  return (
    <section className="Events" aria-labelledby="events-heading">
      <div className="Events__head">
        
        <CurvedLoop
          marqueeText="UPCOMING EVENTS ✦ SESSIONS ✦ INNOVATION ✦ COMMUNITY ✦ COLLABORATION ✦ GROWTH ✦"
          speed={1}
          curveAmount={30}
          direction="right"
          interactive={true}
          className="Events__marquee Events__marquee--cyan"
        />
        <CurvedLoop
          marqueeText="LEARN ✦ BUILD ✦ SHARE ✦ LEAD ✦ CREATE ✦ NETWORK ✦ ACHIEVE ✦ IMPACT ✦"
          speed={1}
          curveAmount={30}
          direction="left"
          interactive={true}
          className="Events__marquee Events__marquee--orange"
        />
        <h2 id="events-heading" className="Events__title">Latest Sessions & Events</h2>
      </div>
      <div className="Events__grid">
        {mockEvents.map(ev => (
          <motion.article
            key={ev.id}
            className="EventCard"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: .6, ease: 'easeOut' }}
            whileHover={{ y: -10, boxShadow: '0 14px 40px -12px rgba(0,0,0,.65), 0 0 0 1px rgba(0,119,204,.5)' }}
          >
            <div className="EventCard__media" />
            <div className="EventCard__body">
              <h3 className="EventCard__title">{ev.title}</h3>
              <p className="EventCard__meta">{ev.date} • {ev.time}</p>
              <motion.button className="EventCard__btn" whileHover={{ scale: 1.07 }} whileTap={{ scale: .92 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>{ev.action}</motion.button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default EventsSection;
