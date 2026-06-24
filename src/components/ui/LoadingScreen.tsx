'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(container, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power3.inOut',
          onComplete: () => { setVisible(false); onComplete(); },
        });
      },
    });

    tl.to(path, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0.2)
      .to(path, { opacity: 0, duration: 0.3 }, '+=0.2');
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        background: '#050505',
        zIndex: 100000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 24,
      }}
    >
      <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          ref={pathRef}
          d="M8 80 L8 10 L42 10 Q70 10 70 38 Q70 60 42 60 L8 60 M90 80 L90 10 L125 10 Q138 10 138 22 Q138 34 125 40 L138 80"
          stroke="#0ae448"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div style={{
        width: 120, height: 1,
        background: 'linear-gradient(90deg, transparent, #0ae448, transparent)',
        opacity: 0.4,
      }} />
    </div>
  );
}
