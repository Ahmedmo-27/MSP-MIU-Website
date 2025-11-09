import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import './SponsorsSection.css';

// Memoized data arrays to prevent recreation
const sponsors = [
    { id: 's1', name: 'Microsoft', logo: '', url: '#' },
    { id: 's2', name: 'Azure', logo: '', url: '#' },
    { id: 's3', name: 'GitHub', logo: '', url: '#' },
    { id: 's4', name: 'OpenAI', logo: '', url: '#' }
];

const counters = [
    { id: 'c1', label: 'Members', value: 120 },
    { id: 'c2', label: 'Events', value: 58 },
    { id: 'c3', label: 'Projects', value: 24 }
];

const SponsorsSection = memo(() => {
    // Memoize animation props to prevent recreation
    const sponsorHoverAnimation = useMemo(() => ({ scale: 1.08, filter: 'grayscale(0) brightness(1.15)' }), []);
    const sponsorInitialAnimation = useMemo(() => ({ opacity: 0, y: 24 }), []);
    const sponsorWhileInViewAnimation = useMemo(() => ({ opacity: 1, y: 0 }), []);
    const sponsorViewportProps = useMemo(() => ({ once: true, amount: 0.25 }), []);
    const sponsorTransition = useMemo(() => ({ type: 'spring', stiffness: 420, damping: 32 }), []);
    
    const counterInitialAnimation = useMemo(() => ({ opacity: 0, y: 18 }), []);
    const counterWhileInViewAnimation = useMemo(() => ({ opacity: 1, y: 0 }), []);
    const counterViewportProps = useMemo(() => ({ once: true, amount: 0.3 }), []);
    const counterHoverAnimation = useMemo(() => ({ y: -6, boxShadow: '0 12px 34px -10px rgba(0,0,0,.6), 0 0 0 1px rgba(0,119,204,.4)' }), []);

    return (
        <section className="Sponsors" aria-labelledby="sponsors-heading">
            <div className="Sponsors__head"><h2 id="sponsors-heading" className="Sponsors__title">Our Partners & Milestones</h2></div>
            <div className="Sponsors__grid">
                {sponsors.map(s => (
                    <motion.a
                        key={s.id}
                        href={s.url}
                        className="SponsorLogo"
                        whileHover={sponsorHoverAnimation}
                        initial={sponsorInitialAnimation}
                        whileInView={sponsorWhileInViewAnimation}
                        viewport={sponsorViewportProps}
                    >
                        <div className="SponsorLogo__img" data-name={s.name}>{s.logo || s.name}</div>
                    </motion.a>
                ))}
            </div>
            <div className="Sponsors__counters">
                {counters.map(c => (
                    <motion.div
                        key={c.id}
                        className="Counter"
                        initial={counterInitialAnimation}
                        whileInView={counterWhileInViewAnimation}
                        viewport={counterViewportProps}
                        whileHover={counterHoverAnimation}
                    >
                        <div className="Counter__value" data-target={c.value}>{c.value}+</div>
                        <div className="Counter__label">{c.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
});

SponsorsSection.displayName = 'SponsorsSection';

export default SponsorsSection;
