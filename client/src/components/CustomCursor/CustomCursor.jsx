import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

// Functional component implementing a smooth, animated custom cursor
const CustomCursor = memo(() => {
  const [active, setActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // Start with true to avoid flicker
  const [isVisible, setIsVisible] = useState(true); // Track page visibility
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Reduced spring stiffness for smoother performance
  const springX = useSpring(x, { stiffness: 180, damping: 25, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 180, damping: 25, mass: 0.8 });

  // Memoized event handlers with visibility check
  const move = useCallback((e) => {
    // Only update position if page is visible for better performance
    if (isVisible) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
  }, [x, y, isVisible]);

  const activate = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => setActive(false), []);

  useEffect(() => {
    // Visibility detection for performance optimization
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    // Page visibility API for performance optimization
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Check if device supports mouse (desktop)
    const checkIsDesktop = () => {
      // Simplified desktop detection - if screen is wide enough, assume desktop
      const isWideScreen = window.innerWidth >= 781;
      const hasHover = window.matchMedia('(hover: hover)').matches;
      
      // Show cursor on wide screens or if hover is supported
      const isDesktopDevice = isWideScreen || hasHover;
      setIsDesktop(isDesktopDevice);
      
      // Cursor hiding is handled by CSS media queries in styles.css
    };
    
    checkIsDesktop();
    
    // Listen for window resize to handle device changes
    const handleResize = () => checkIsDesktop();
    window.addEventListener('resize', handleResize);
    
    // Enhanced throttling with visibility check for better performance
    let ticking = false;
    const throttledMove = (e) => {
      if (!ticking && isDesktop && isVisible) {
        requestAnimationFrame(() => {
          move(e);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', throttledMove, { passive: true });

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
      // Cleanup event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.removeEventListener('mouseenter', activate);
        el.removeEventListener('mouseleave', deactivate);
      });
    };
  }, [move, activate, deactivate, isVisible]);

  // Only render custom cursor on desktop devices
  if (!isDesktop) {
    return null;
  }

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
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
