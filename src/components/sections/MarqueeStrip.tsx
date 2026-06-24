'use client';

import { useEffect, useRef, useState } from 'react';

const MARQUEE_ITEMS = [
  'REACT', 'NEXT.JS', 'NODE.JS', 'GSAP', 'THREE.JS', 'PYTHON',
  'ALGORITHMIC TRADING', 'QUANTITATIVE FINANCE', 'WEBGL', 'FIGMA',
  'TYPESCRIPT', 'BLACKOBSIDIAN', 'ZORVAIN STREET', 'FRAMER MOTION', 'TAILWIND',
];

export default function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reversed, setReversed] = useState(false);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      style={{
        background: '#0ae448',
        padding: '18px 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2,
      }}
      onMouseEnter={() => { setPaused(true); setReversed(true); }}
      onMouseLeave={() => { setPaused(false); setReversed(false); }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 0,
          width: 'max-content',
          animationName: reversed ? 'marqueeReverse' : 'marquee',
          animationDuration: '30s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              padding: '0 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}
          >
            {item}
            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#000', opacity: 0.4 }} />
          </span>
        ))}
      </div>
    </div>
  );
}
