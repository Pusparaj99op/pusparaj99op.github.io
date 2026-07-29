'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 65, suffix: '+', label: 'Repositories' },
  { target: 2, suffix: '', label: 'Companies Founded' },
  { display: 'AIR 7616', label: 'JEE Advanced 2024' },
  { display: 'FIDE', label: 'Chess Rated' },
];

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const counters = section.querySelectorAll<HTMLElement>('.stat-number[data-target]');
    const ctx = gsap.context(() => {
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target || '0', 10);
        const suffix = counter.dataset.suffix || '';
        gsap.fromTo({ val: 0 }, { val: 0 }, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { val: 1 },
          scrollTrigger: { trigger: counter, start: 'top 85%', once: true },
          onUpdate: function () {
            counter.textContent = Math.round(this.targets()[0].val) + suffix;
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-dim)',
        borderBottom: '1px solid var(--border-dim)',
        padding: '48px 0',
      }}
    >
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      }} className="stats-grid">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid var(--border-dim)' : 'none',
              padding: '0 16px',
            }}
          >
            <div
              className={stat.target !== undefined ? 'stat-number font-display' : 'font-display'}
              data-target={stat.target}
              data-suffix={stat.suffix}
              style={{
                fontWeight: 900, fontStyle: 'italic',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: 'var(--text-primary)',
              }}
            >
              {stat.display ?? '0' + (stat.suffix || '')}
            </div>
            <div className="font-mono" style={{
              marginTop: 8, fontSize: 11, textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)', color: 'var(--text-tertiary)',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; row-gap: 32px; }
          .stats-grid > div:nth-child(2n) { border-right: none !important; }
        }
      `}</style>
    </section>
  );
}
