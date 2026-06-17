import React, { useEffect, useRef } from 'react';
import { initCursorEffect } from './app.js';
import './style.scss';

export default function FluidCursorOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const effect = initCursorEffect(container);

    return () => {
      if (effect && typeof effect.destroy === 'function') {
        effect.destroy();
      }
    };
  }, []);

  return (
    <main
      ref={containerRef}
      id="scene"
      className="scene"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none', // Set pointer events to none so users can click elements underneath, but wait:
        // If pointer-events is 'none' on the main container, does Chrome dispatch mousemove events to the container?
        // Yes, window mousemove events will still trigger since pointer.js binds listeners on window/document!
        // So pointer tracking works perfectly even with pointer-events: none!
      }}
    />
  );
}
