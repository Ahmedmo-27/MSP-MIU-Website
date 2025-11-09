import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import './MemberSection.css';

// Memoized data arrays to prevent recreation
const notifications = [
  { id: 'n1', text: 'Azure session starts in 2 hours' },
  { id: 'n2', text: 'You joined AI Study Jam' },
  { id: 'n3', text: 'Reminder: Submit Hackathon idea' }
];

const registered = [
  { id: 'r1', title: 'Intro to Azure', date: 'Oct 15' },
  { id: 'r2', title: 'AI Study Jam', date: 'Oct 18' }
];

const exercises = [
  { id: 'x1', title: 'JS Async Patterns', due: 'Due Oct 20' },
  { id: 'x2', title: 'Git Workflow Drill', due: 'Due Oct 22' }
];

const MemberSection = memo(({ isMember = false }) => {
  if (!isMember) return null;

  // Memoize animation props to prevent recreation
  const cardHoverAnimation = useMemo(() => ({ y: -8 }), []);
  
  return (
    <section className="MemberDash" aria-labelledby="member-dash-heading">
      <div className="MemberDash__head"><h2 id="member-dash-heading" className="MemberDash__title">Your Dashboard</h2></div>
      <div className="MemberDash__grid">
        <motion.div className="DashCard" whileHover={cardHoverAnimation}>
          <h3 className="DashCard__title">Registered Events</h3>
          <ul className="DashList">
            {registered.map(r => <li key={r.id} className="DashList__item"><span>{r.title}</span><time>{r.date}</time></li>)}
          </ul>
        </motion.div>
        <motion.div className="DashCard" whileHover={cardHoverAnimation}>
          <h3 className="DashCard__title">Exercise Reminders</h3>
          <ul className="DashList">
            {exercises.map(e => <li key={e.id} className="DashList__item"><span>{e.title}</span><em>{e.due}</em></li>)}
          </ul>
        </motion.div>
        <motion.div className="DashCard" whileHover={cardHoverAnimation}>
          <div className="DashCard__titleWrap">
            <h3 className="DashCard__title">Notifications</h3>
            <motion.div className="Bell">
              <span className="Bell__icon">🔔</span>
              <span className="Bell__badge">{notifications.length}</span>
              <div className="Bell__dropdown">
                <ul>{notifications.map(n => <li key={n.id}>{n.text}</li>)}</ul>
              </div>
            </motion.div>
          </div>
          <p className="DashHint">Latest 3 notifications shown above.</p>
        </motion.div>
      </div>
    </section>
  );
});

MemberSection.displayName = 'MemberSection';

export default MemberSection;
