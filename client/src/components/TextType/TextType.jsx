import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import './TextType.css';

const TextType = memo(({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  cursorCharacter = '|',
  textColors = [],
  variableSpeed,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const isVisibleRef = useRef(false);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
  }, [variableSpeed, typingSpeed]);

  const textColor = useMemo(() => {
    return textColors.length > 0 ? textColors[currentTextIndex % textColors.length] : '#ffffff';
  }, [textColors, currentTextIndex]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        isVisibleRef.current = visible;
        setIsVisible(visible);
        if (!visible && timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const currentText = textArray[currentTextIndex] || '';

    const animate = () => {
      if (!isVisibleRef.current) return;
      
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) return;
          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeoutRef.current = setTimeout(animate, pauseDuration);
        } else {
          timeoutRef.current = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
            animate();
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < currentText.length) {
          timeoutRef.current = setTimeout(() => {
            setDisplayedText(prev => prev + currentText[currentCharIndex]);
            setCurrentCharIndex(prev => prev + 1);
            animate();
          }, getSpeed());
        } else if (textArray.length > 1) {
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
            animate();
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeoutRef.current = setTimeout(animate, initialDelay);
    } else {
      animate();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentCharIndex, displayedText, isDeleting, textArray, currentTextIndex, isVisible, loop, initialDelay, pauseDuration, deletingSpeed, typingSpeed, getSpeed]);

  const ComponentTag = Component;

  return (
    <ComponentTag
      ref={containerRef}
      className={`text-type ${className}`}
      {...props}
    >
      <span className="text-type__content" style={{ color: textColor }}>
        {displayedText}
      </span>
      {showCursor && isVisible && (
        <span className="text-type__cursor">
          {cursorCharacter}
        </span>
      )}
    </ComponentTag>
  );
});

TextType.displayName = 'TextType';

export default TextType;
