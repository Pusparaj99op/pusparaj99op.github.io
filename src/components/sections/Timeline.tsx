'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBadge from '@/components/ui/SectionBadge';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const entries = [
  {
    period: '2024 – Present',
    role: 'International UAE Team Manager',
    org: 'Devnovate',
    desc: 'Led the UAE international team for Devnovate, coordinating cross-border hackathon and innovation initiatives.',
  },
  {
    period: '2024 – Present',
    role: 'Founder',
    org: 'Zorvain Street',
    desc: 'Founded algorithmic trading company building autonomous systems for Nifty 50, XAUUSD, and crypto derivatives.',
  },
  {
    period: '2024 – Present',
    role: 'Founder',
    org: 'BlackObsidian (AMC)',
    desc: 'Established an asset management company focused on systematic portfolio strategies and quantitative investing.',
  },
  {
    period: '2024',
    role: 'NISM Series 8 Certified',
    org: 'National Institute of Securities Markets',
    desc: 'Achieved certification in equity derivatives, validating deep knowledge of Indian derivatives markets.',
  },
  {
    period: '2024',
    role: 'AIR 7616',
    org: 'JEE Advanced 2024',
    desc: 'Ranked All India Rank 7616 in JEE Advanced 2024, one of India\'s most competitive engineering entrance exams.',
  },
  {
    period: '2024 – Present',
    role: 'B.Tech Computer Science Engineering',
    org: 'University',
    desc: 'Pursuing bachelor\'s degree with focus on algorithms, systems design, and quantitative computing.',
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const line = lineRef.current;
    if (!line) return;

    gsap.fromTo(line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="section-padding"
      style={{ background: 'var(--bg-primary)', position: 'relative' }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
        <SectionBadge id="PG — 06" label="The Journey So Far" />

        <div style={{ position: 'relative', paddingLeft: 32 }}>
          <div style={{
            position: 'absolute', left: 0, top: 6, bottom: 0,
            width: 1, background: 'var(--border-dim)',
          }} />
          <div
            ref={lineRef}
            style={{
              position: 'absolute', left: 0, top: 6, bottom: 0,
              width: 1, transform: 'scaleY(0)',
              background: 'var(--accent-gold)',
              transformOrigin: 'top center',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {entries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                style={{ position: 'relative' }}
              >
                <div style={{
                  position: 'absolute', left: -37, top: 6,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent-gold)',
                }} />

                <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 }}>
                  {entry.period}
                </div>
                <h3 className="font-display" style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                  {entry.role}
                </h3>
                <div className="font-body" style={{ fontSize: 14, color: 'var(--accent-gold)', fontWeight: 500, marginBottom: 10 }}>
                  {entry.org}
                </div>
                <p className="font-body" style={{ fontWeight: 300, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 560 }}>
                  {entry.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
