import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  trigger: boolean;
  minStart: number;
  maxStart: number;
}

export default function AnimatedCounter({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1500,
  trigger,
  minStart,
  maxStart
}: AnimatedCounterProps) {
  // Generate random starting number once on component initialization
  const [startValue] = useState(() => {
    const randomVal = Math.random() * (maxStart - minStart) + minStart;
    return parseFloat(randomVal.toFixed(decimals));
  });

  const [currentValue, setCurrentValue] = useState(startValue);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) {
      // Keep showing the initial startValue until triggered
      setCurrentValue(startValue);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const rate = Math.min(progress / duration, 1);
      
      // Easing out quadratic for a smooth deceleration effect
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedRate = easeOutQuad(rate);

      const val = startValue + (target - startValue) * easedRate;
      setCurrentValue(parseFloat(val.toFixed(decimals)));

      if (rate < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, startValue, target, duration, decimals]);

  return (
    <span>
      {prefix}
      {currentValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
}
