'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 65, suffix: '+', label: 'Repositories', prefix: '' },
  { value: 2, suffix: '', label: 'Companies Founded', prefix: '' },
  { value: 7616, suffix: '', label: 'JEE Advanced AIR', prefix: 'AIR ', isText: false, displayText: 'AIR 7616' },
  { value: 0, suffix: '', label: 'Chess Rating', prefix: '', displayText: 'FIDE', isStatic: true },
];

function CountUp({ target, prefix, suffix, displayText, isStatic, started }: {
  target: number; prefix: string; suffix: string;
  displayText?: string; isStatic?: boolean; started: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (isStatic || displayText) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + increment, target);
      setCount(Math.round(start));
      if (start >= target) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [started, target, isStatic, displayText]);

  if (isStatic || displayText) return <>{displayText}</>;
  return <>{prefix}{count}{suffix}</>;
}

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStarted(true);
      return;
    }
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      onEnter: () => setStarted(true),
    });
    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      style={{
        background: 'var(--bg-secondary)',
        padding: 'clamp(80px,10vw,140px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Noise + glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(10,228,72,0.04) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px,5vw,64px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <span className="label-text" style={{ display: 'block', marginBottom: 16 }}>// achievements</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(32px,4vw,52px)', color: '#f0f0f0', letterSpacing: '-0.03em',
          }}>
            Numbers That <span style={{ color: '#0ae448' }}>Matter.</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
          gap: 0,
        }}>
          {stats.map((stat, i) => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'stretch' }}>
              {i > 0 && (
                <div style={{
                  width: 1, background: 'rgba(10,228,72,0.15)',
                  margin: '0 clamp(24px,4vw,56px)',
                  alignSelf: 'stretch',
                }} />
              )}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{ textAlign: 'center', padding: '0 clamp(16px,3vw,32px)' }}
              >
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: 'clamp(40px,5vw,80px)',
                  color: '#0ae448', lineHeight: 1, letterSpacing: '-0.04em',
                  marginBottom: 12,
                }}>
                  <CountUp
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    displayText={stat.displayText}
                    isStatic={stat.isStatic}
                    started={started}
                  />
                </div>
                <div className="label-text">{stat.label}</div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Extra badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 64,
          }}
        >
          {['NISM Series 8 Certified', 'FIDE Rated Chess Player', 'B.Tech CSE', 'Meydan Freezone, Dubai'].map(badge => (
            <span key={badge} style={{
              padding: '8px 18px', borderRadius: 9999,
              background: 'rgba(10,228,72,0.06)',
              border: '1px solid rgba(10,228,72,0.15)',
              fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
              color: '#0ae448',
            }}>
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
