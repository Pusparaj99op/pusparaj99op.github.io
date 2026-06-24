'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX - 3, y: mouseY - 3 });
    };

    const animate = () => {
      ringX += (mouseX - ringX - 20) * 0.1;
      ringY += (mouseY - ringY - 20) * 0.1;
      gsap.set(ring, { x: ringX, y: ringY });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const isCard = target.hasAttribute('data-cursor-card');
      gsap.to(ring, { width: 72, height: 72, opacity: 0.9, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
      if (textRef.current) textRef.current.textContent = isCard ? 'VIEW' : '';
    };

    const onLeave = () => {
      gsap.to(ring, { width: 40, height: 40, opacity: 0.5, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { opacity: 1, duration: 0.2 });
      if (textRef.current) textRef.current.textContent = '';
    };

    const bind = () => {
      document.querySelectorAll('a, button, [data-cursor], [data-cursor-card]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    bind();
    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 40, height: 40, borderRadius: '50%',
          border: '1px solid #0ae448', opacity: 0.5,
          pointerEvents: 'none', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,228,72,0.04)',
          willChange: 'transform',
          transition: 'background 0.3s',
        }}
      >
        <span
          ref={textRef}
          style={{ fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: '0.1em', color: '#0ae448' }}
        />
      </div>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6, borderRadius: '50%',
          background: '#0ae448', pointerEvents: 'none',
          zIndex: 99999, willChange: 'transform',
        }}
      />
    </>
  );
}
