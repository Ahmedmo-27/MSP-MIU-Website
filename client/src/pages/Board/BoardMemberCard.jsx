import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import './Board.css';

const BoardMemberCard = memo(({ member, index }) => {
  const cardAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: index * 0.1 }
  };

  const hoverAnimation = { y: -8, scale: 1.02 };

  return (
    <motion.article
      className="BoardMemberCard"
      {...cardAnimation}
      whileHover={hoverAnimation}
    >
      <div className="BoardMemberCard__header">
        {member.image && (
          <div className="BoardMemberCard__image">
            <img src={member.image} alt={member.name} />
          </div>
        )}
        <div className="BoardMemberCard__badge">{member.role}</div>
      </div>
      <div className="BoardMemberCard__body">
        <h3 className="BoardMemberCard__name">{member.name}</h3>
        <p className="BoardMemberCard__description">{member.description}</p>
        {member.skills && member.skills.length > 0 && (
          <div className="BoardMemberCard__skills">
            {member.skills.map((skill, i) => (
              <span key={i} className="BoardMemberCard__skill">{skill}</span>
            ))}
          </div>
        )}
        {(member.linkedin || member.github || member.email) && (
          <div className="BoardMemberCard__social">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`}>
                <FaLinkedin />
              </a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub`}>
                <FaGithub />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                <FaEnvelope />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
});

BoardMemberCard.displayName = 'BoardMemberCard';
export default BoardMemberCard;

