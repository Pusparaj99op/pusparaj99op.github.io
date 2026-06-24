'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticElement({ children, className = '', strength = 0.3 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,0.4)' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      if (Math.sqrt(dx * dx + dy * dy) < 80) {
        xTo(dx * strength);
        yTo(dy * strength);
      }
    };

    const onLeave = () => { xTo(0); yTo(0); };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </div>
  );
}
