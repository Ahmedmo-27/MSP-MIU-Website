import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiCalendar, FiTarget } from 'react-icons/fi';
import './Board.css';

const BoardStats = memo(({ stats }) => {
  const statItems = useMemo(() => [
    { icon: <FiUsers />, label: 'Board Members', value: stats?.members || 0 },
    { icon: <FiAward />, label: 'Years Combined', value: stats?.experience || 0 },
    { icon: <FiCalendar />, label: 'Events Organized', value: stats?.events || 0 },
    { icon: <FiTarget />, label: 'Projects Led', value: stats?.projects || 0 }
  ], [stats]);

  const itemAnimation = useMemo(() => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  }), []);

  const hoverAnimation = useMemo(() => ({ scale: 1.1, y: -5 }), []);

  return (
    <motion.section 
      className="BoardStats"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="BoardStats__grid">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="BoardStatCard"
            {...itemAnimation}
            transition={{ delay: index * 0.1 }}
            whileHover={hoverAnimation}
          >
            <div className="BoardStatCard__icon">{item.icon}</div>
            <div className="BoardStatCard__value">{item.value}+</div>
            <div className="BoardStatCard__label">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
});

BoardStats.displayName = 'BoardStats';
export default BoardStats;

