import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import './FeedSection.css';

const FeedSection = memo(({ isMember = false }) => {
  const announcements = useMemo(() => ([
    { id: 'a1', title: 'Welcome New Members', dept: 'Community', date: '2025-10-01', desc: 'Kickoff meetup next week – stay tuned!', priority: true },
    { id: 'a2', title: 'AI Bootcamp Signup', dept: 'AI', date: '2025-10-02', desc: 'Limited seats for intensive ML crash course.', priority: false },
    { id: 'a3', title: 'Hackathon Teaser', dept: 'Development', date: '2025-10-03', desc: 'Prepare your teams. More info dropping soon.', priority: false },
    { id: 'a4', title: 'UI/UX Workshop', dept: 'Design', date: '2025-10-05', desc: 'Hands-on Figma + rapid prototyping session.', priority: false },
    { id: 'a5', title: 'Cloud Study Group', dept: 'Cloud', date: '2025-10-06', desc: 'Weekly Azure fundamentals deep dive.', priority: false }
  ]), []);

  const data = useMemo(() => {
    if (!isMember) return announcements;
    return [
      { id: 'm0', title: 'Your Interview Tomorrow', dept: 'Personal', date: '2025-10-08', desc: 'Remember to review the technical guidelines.', priority: true },
      ...announcements
    ];
  }, [announcements, isMember]);

  return (
    <section className="Feed" aria-labelledby="feed-heading">
      <div className="Feed__head"><h2 id="feed-heading" className="Feed__title">Announcements & Updates</h2></div>
      <div className="Feed__grid">
        {data.map(a => (
          <motion.article
            key={a.id}
            className={`FeedCard ${a.priority ? 'is-priority' : ''}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8 }}
          >
            <div className="FeedCard__top">
              <span className="FeedCard__dept" data-dept={a.dept}>{a.dept}</span>
              <time className="FeedCard__date" dateTime={a.date}>{a.date}</time>
            </div>
            <h3 className="FeedCard__title">{a.title}</h3>
            <p className="FeedCard__desc">{a.desc}</p>
            <motion.a href="#" className="FeedCard__more" whileHover={{ color: '#fff', x: 3 }}>Read more →</motion.a>
          </motion.article>
        ))}
      </div>
    </section>
  );
});

FeedSection.displayName = 'FeedSection';

export default FeedSection;
