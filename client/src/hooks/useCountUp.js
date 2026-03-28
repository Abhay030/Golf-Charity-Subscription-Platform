import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useCountUp — animated number counter for stat displays.
 * 
 * Usage:
 *   const displayValue = useCountUp(targetValue, { duration: 1200 });
 */
const useCountUp = (target, options = {}) => {
  const { duration = 1000, prefix = '', suffix = '', decimals = 0 } = options;
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  const animate = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    setValue(eased * target);

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [target, duration]);

  useEffect(() => {
    if (typeof target !== 'number' || target === 0) {
      setValue(target || 0);
      return;
    }
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, animate]);

  const formatted = `${prefix}${value.toFixed(decimals)}${suffix}`;
  return formatted;
};

export default useCountUp;
