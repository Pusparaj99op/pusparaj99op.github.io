'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        height: 1, width: '0%',
        background: '#c9a96e',
        zIndex: 99997,
        boxShadow: '0 0 10px #c9a96e80',
        transition: 'width 0.05s linear',
        pointerEvents: 'none',
      }}
    />
  );
}
