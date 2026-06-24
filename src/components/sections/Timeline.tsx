'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const entries = [
  {
    period: '2024 – Present',
    role: 'International UAE Team Manager',
    org: 'Devnovate',
    desc: 'Led the UAE international team for Devnovate, coordinating cross-border hackathon and innovation initiatives.',
    side: 'right',
    accent: '#0ae448',
  },
  {
    period: '2024 – Present',
    role: 'Founder',
    org: 'Zorvain Street',
    desc: 'Founded algorithmic trading company building autonomous systems for Nifty 50, XAUUSD, and crypto derivatives.',
    side: 'left',
    accent: '#7dd3fc',
  },
  {
    period: '2024 – Present',
    role: 'Founder',
    org: 'BlackObsidian (AMC)',
    desc: 'Established an asset management company focused on systematic portfolio strategies and quantitative investing.',
    side: 'right',
    accent: '#c4b5fd',
  },
  {
    period: '2024',
    role: 'NISM Series 8 Certified',
    org: 'National Institute of Securities Markets',
    desc: 'Achieved certification in equity derivatives, validating deep knowledge of Indian derivatives markets.',
    side: 'left',
    accent: '#fde68a',
  },
  {
    period: '2024',
    role: 'AIR 7616',
    org: 'JEE Advanced 2024',
    desc: 'Ranked All India Rank 7616 in JEE Advanced 2024, one of India\'s most competitive engineering entrance exams.',
    side: 'right',
    accent: '#fb923c',
  },
  {
    period: '2024 – Present',
    role: 'B.Tech Computer Science Engineering',
    org: 'University',
    desc: 'Pursuing bachelor\'s degree with focus on algorithms, systems design, and quantitative computing.',
    side: 'left',
    accent: '#34d399',
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
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
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
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px,5vw,64px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 80, textAlign: 'center' }}
        >
          <span className="label-text" style={{ display: 'block', marginBottom: 16 }}>// timeline</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(32px,4vw,52px)', color: '#f0f0f0',
            letterSpacing: '-0.03em',
          }}>
            The <span style={{ color: '#0ae448' }}>Journey</span> So Far.
          </h2>
        </motion.div>

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
          {/* Center line */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1, transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.06)',
          }} />
          <div
            ref={lineRef}
            style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: 1, transform: 'translateX(-50%) scaleY(0)',
              background: 'linear-gradient(to bottom, transparent, #0ae448, transparent)',
              transformOrigin: 'top center',
            }}
          />

          {/* Entries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
            {entries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: entry.side === 'right' ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25,0.46,0.45,0.94] }}
                style={{
                  display: 'flex',
                  justifyContent: entry.side === 'right' ? 'flex-start' : 'flex-end',
                  paddingLeft: entry.side === 'right' ? 'calc(50% + 32px)' : '0',
                  paddingRight: entry.side === 'left' ? 'calc(50% + 32px)' : '0',
                }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                  width: 12, height: 12, borderRadius: '50%',
                  background: entry.accent,
                  border: `2px solid ${entry.accent}40`,
                  boxShadow: `0 0 12px ${entry.accent}60`,
                }} />

                {/* Card */}
                <div
                  className="glass-card"
                  style={{
                    padding: '24px 28px',
                    maxWidth: 380, width: '100%',
                    borderLeft: `2px solid ${entry.accent}30`,
                  }}
                >
                  <div className="label-text" style={{ marginBottom: 8, color: entry.accent, opacity: 0.7 }}>
                    {entry.period}
                  </div>
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: 17, color: '#f0f0f0', marginBottom: 4,
                  }}>
                    {entry.role}
                  </h3>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 13,
                    color: entry.accent, fontWeight: 500, marginBottom: 10,
                  }}>
                    {entry.org}
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#777', lineHeight: 1.7 }}>
                    {entry.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
