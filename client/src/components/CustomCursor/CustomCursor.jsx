import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

// Functional component implementing a smooth, animated custom cursor
const CustomCursor = () => {
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Spring for smooth interpolation
  const springX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const activate = () => setActive(true);
    const deactivate = () => setActive(false);

    window.addEventListener('mousemove', move, { passive: true });

    // Delegate interactive targets
    const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], .interactive';
    const addListeners = () => {
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', activate);
        el.addEventListener('mouseleave', deactivate);
      });
    };

    addListeners();

    // MutationObserver to handle dynamically added interactive elements
    const observer = new MutationObserver(() => addListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      observer.disconnect();
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.removeEventListener('mouseenter', activate);
        el.removeEventListener('mouseleave', deactivate);
      });
    };
  }, [x, y]);

  return (
    <motion.div
      className={`CustomCursor ${active ? 'is-active' : ''}`}
      style={{
        translateX: springX,
        translateY: springY,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <div className="CustomCursor__core" />
    </motion.div>
  );
};

export default CustomCursor;
