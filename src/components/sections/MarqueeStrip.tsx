'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MARQUEE_ITEMS = [
  'REACT', 'NEXT.JS', 'NODE.JS', 'GSAP', 'THREE.JS', 'PYTHON',
  'ALGO TRADING', 'QUANT FINANCE', 'WEBGL', 'FIGMA',
  'TYPESCRIPT', 'BLACKOBSIDIAN', 'ZORVAIN STREET', 'FRAMER MOTION',
];

export default function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(track, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      });
    }, track);

    return () => ctx.revert();
  }, []);

  const handleEnter = () => {
    tweenRef.current?.pause();
  };
  const handleLeave = () => {
    tweenRef.current?.play();
  };

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid var(--border-dim)',
        borderBottom: '1px solid var(--border-dim)',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 0,
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-mono"
            style={{
              fontWeight: 400,
              fontSize: 11,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.10em',
              whiteSpace: 'nowrap',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {item}
            <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-gold)', opacity: 0.6 }} />
          </span>
        ))}
      </div>
    </div>
  );
}
