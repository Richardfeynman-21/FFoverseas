'use client';

import React, { useEffect, useRef } from 'react';

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
  const spanRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Calculate start value once and store in a ref to avoid re-renders
  const startValueRef = useRef<number>(0);

  useEffect(() => {
    const randomVal = Math.random() * (maxStart - minStart) + minStart;
    startValueRef.current = parseFloat(randomVal.toFixed(decimals));
    
    // Set initial text content
    if (spanRef.current) {
      spanRef.current.textContent = `${prefix}${startValueRef.current.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${suffix}`;
    }
  }, [minStart, maxStart, decimals, prefix, suffix]);

  useEffect(() => {
    if (!trigger) {
      // Keep showing the initial startValue until triggered
      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${startValueRef.current.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })}${suffix}`;
      }
      return;
    }

    startTimeRef.current = null; // reset start time on trigger change

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const rate = Math.min(progress / duration, 1);
      
      // Easing out quadratic for a smooth deceleration effect
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedRate = easeOutQuad(rate);

      const val = startValueRef.current + (target - startValueRef.current) * easedRate;
      const formattedVal = parseFloat(val.toFixed(decimals)).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });

      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${formattedVal}${suffix}`;
      }

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
  }, [trigger, target, duration, decimals, prefix, suffix]);

  return <span ref={spanRef} />;
}
