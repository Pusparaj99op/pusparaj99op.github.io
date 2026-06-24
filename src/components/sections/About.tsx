'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const TERMINAL_LINES = [
  '> const pranay = {',
  '>   role: ["Dev", "Quant", "Founder"],',
  '>   companies: ["BlackObsidian", "Zorvain Street"],',
  '>   stack: ["React", "Node", "Python", "GSAP"],',
  '>   philosophy: "Systems thinking at scale",',
  '>   chess: "FIDE Rated ♟",',
  '> }',
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentChar, setCurrentChar] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [started, setStarted] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (!started) return;
    if (currentLine >= TERMINAL_LINES.length) return;
    const line = TERMINAL_LINES[currentLine];
    if (currentChar < line.length) {
      const t = setTimeout(() => setCurrentChar(c => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayedLines(prev => [...prev, line]);
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 80);
      return () => clearTimeout(t);
    }
  }, [started, currentLine, currentChar]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => setStarted(true),
    });

    // Parallax card
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 40 },
        {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: cardRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        }
      );
    }
  }, []);

  const currentDisplayLine = currentLine < TERMINAL_LINES.length
    ? TERMINAL_LINES[currentLine].slice(0, currentChar)
    : '';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding"
      style={{ background: 'var(--bg-primary)', position: 'relative' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px,5vw,64px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: 80, alignItems: 'center',
        }}>
          {/* LEFT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 24 }}
            >
              <span className="label-text">// about me</span>
            </motion.div>

            <motion.h2
              ref={headlineRef}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25,0.46,0.45,0.94] }}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(32px, 4vw, 52px)',
                lineHeight: 1.1, letterSpacing: '-0.03em',
                color: '#f0f0f0', marginBottom: 32,
              }}
            >
              I Build at the{' '}
              <span style={{ color: '#0ae448' }}>Intersection</span>
              {' '}of Code & Capital.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: 16,
                color: '#888', lineHeight: 1.8, marginBottom: 20,
              }}
            >
              I&apos;m Pranay Krupakar Gajbhiye — Full Stack Developer, Quant, and Founder
              of BlackObsidian (AMC) and Zorvain Street, an algorithmic trading company
              building autonomous systems for derivatives and crypto markets.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: 16,
                color: '#888', lineHeight: 1.8, marginBottom: 48,
              }}
            >
              Beyond code, I&apos;m a FIDE-rated chess player, a NISM Series 8 certified
              quant, and ranked AIR 7616 in JEE Advanced 2024. I approach every
              problem like a chess game — with depth, patience, and strategy.
            </motion.p>

            {/* Company cards */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
            >
              {[
                { name: 'BlackObsidian', sub: 'Asset Management Company', icon: '◆' },
                { name: 'Zorvain Street', sub: 'Algorithmic Trading', icon: '◈' },
              ].map(c => (
                <div key={c.name} className="glass-card-accent" style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: 20, color: '#0ae448', marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f0f0', marginBottom: 4 }}>
                    {c.name}
                  </div>
                  <div className="label-text" style={{ fontSize: 10 }}>{c.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Terminal */}
          <div ref={cardRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25,0.46,0.45,0.94] }}
              className="glass-card"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              {/* Terminal header */}
              <div style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {['#FF5F57','#FFBD2E','#28C840'].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                ))}
                <span style={{ fontFamily: 'Inter, monospace', fontSize: 12, color: '#444', marginLeft: 8 }}>
                  pranay.config.ts
                </span>
              </div>

              {/* Terminal body */}
              <div style={{ padding: '28px 28px 32px', fontFamily: 'monospace', fontSize: 13, lineHeight: 2.1 }}>
                {displayedLines.map((line, i) => (
                  <div key={i} style={{ color: i === 0 || i === 6 ? '#0ae448' : i % 2 === 0 ? '#7dd3fc' : '#f0f0f0' }}>
                    {line}
                  </div>
                ))}
                {currentLine < TERMINAL_LINES.length && (
                  <div style={{ color: currentLine === 0 || currentLine === 6 ? '#0ae448' : '#f0f0f0' }}>
                    {currentDisplayLine}
                    <span className="cursor-blink" />
                  </div>
                )}
                {!started && (
                  <div style={{ color: '#444' }}>
                    <span className="cursor-blink" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
