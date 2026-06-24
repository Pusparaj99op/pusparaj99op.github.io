'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticElement from '@/components/ui/MagneticElement';
import dynamic from 'next/dynamic';

const TorusKnot = dynamic(() => import('@/components/ui/TorusKnot'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { number: '65+', label: 'Repositories' },
  { number: '2', label: 'Companies Founded' },
  { number: 'FIDE', label: 'Chess Rated' },
  { number: 'AIR 7616', label: 'JEE Advanced' },
];

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // GSAP word-by-word headline animation
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = headlineRef.current?.querySelectorAll('.word');
    if (!words) return;
    gsap.set(words, { y: 80, opacity: 0 });
    gsap.to(words, {
      y: 0, opacity: 1, duration: 0.9,
      stagger: 0.06, ease: 'power3.out', delay: 1.6,
    });
  }, []);

  // Mouse parallax blobs
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const b1 = blob1Ref.current;
    const b2 = blob2Ref.current;
    if (!b1 || !b2) return;

    let targetX1 = 0, targetY1 = 0;
    let targetX2 = 0, targetY2 = 0;
    let curX1 = 0, curY1 = 0, curX2 = 0, curY2 = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX1 = (x - cx) * 0.03;
      targetY1 = (y - cy) * 0.02;
      targetX2 = (x - cx) * -0.025;
      targetY2 = (y - cy) * -0.015;
    };

    const animate = () => {
      curX1 += (targetX1 - curX1) * 0.05;
      curY1 += (targetY1 - curY1) * 0.05;
      curX2 += (targetX2 - curX2) * 0.05;
      curY2 += (targetY2 - curY2) * 0.05;
      b1.style.transform = `translate(${curX1}px, ${curY1}px)`;
      b2.style.transform = `translate(${curX2}px, ${curY2}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMouseMove);
    return () => { window.removeEventListener('mousemove', onMouseMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 70% 0%, rgba(10,228,72,0.06) 0%, transparent 60%), var(--bg-primary)',
      }}
    >
      {/* Background blobs */}
      <div ref={blob1Ref} style={{
        position: 'absolute', top: '10%', right: '5%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(10,228,72,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)',
        willChange: 'transform',
      }} />
      <div ref={blob2Ref} style={{
        position: 'absolute', bottom: '15%', left: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(80px)',
        willChange: 'transform',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '100px clamp(24px,5vw,64px) 60px',
        width: '100%', position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 64, alignItems: 'center',
      }}>
        {/* LEFT CONTENT */}
        <div style={{ maxWidth: 780 }}>
          {/* Top label + availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}
          >
            <span className="label-text" style={{ color: '#444' }}>— Founder · BlackObsidian · Zorvain Street</span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 9999,
              border: '1px solid rgba(10,228,72,0.25)',
              background: 'rgba(10,228,72,0.05)',
              fontFamily: 'Inter, sans-serif', fontSize: 11,
              color: '#0ae448', fontWeight: 500,
            }}>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              Available for collaboration
            </span>
          </motion.div>

          {/* Headline */}
          <div
            ref={headlineRef}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(52px, 7vw, 108px)',
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
              color: '#f0f0f0',
              marginBottom: 28,
              overflow: 'hidden',
            }}
          >
            {['Building', 'Systems', 'That', 'Trade,', 'Scale', '&', 'Inspire.'].map((word, i) => (
              <span
                key={i}
                className="word"
                style={{
                  display: 'inline-block',
                  marginRight: word === 'Systems' || word === 'Trade,' || word === 'Inspire.' ? '0' : '0.22em',
                  color: word === '&' || word === 'Inspire.' ? '#0ae448' : '#f0f0f0',
                }}
              >
                {word}
                {(word === 'Systems' || word === 'Trade,') && <br />}
              </span>
            ))}
          </div>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.7 }}
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(15px,1.6vw,18px)',
              color: '#888', lineHeight: 1.75, maxWidth: 560, marginBottom: 44,
            }}
          >
            Full Stack Developer & Quantitative Trader crafting algorithmic systems,
            premium digital products, and scalable web experiences.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 64 }}
          >
            <MagneticElement>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-accent"
                style={{ padding: '14px 32px', fontSize: 15, display: 'inline-block', textDecoration: 'none' }}
              >
                Start a Project →
              </a>
            </MagneticElement>
            <MagneticElement>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-ghost"
                style={{ padding: '13px 30px', fontSize: 15, display: 'inline-block', textDecoration: 'none' }}
              >
                <span className="btn-label">View My Work</span>
              </a>
            </MagneticElement>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#888', fontFamily: 'Inter, sans-serif', fontSize: 14,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                borderBottom: '1px solid rgba(136,136,136,0.3)',
                paddingBottom: 2,
              }}
            >
              Resume ↗
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}
          >
            {stats.map((stat, i) => (
              <div key={stat.label} style={{
                display: 'flex', alignItems: 'stretch',
              }}>
                {i > 0 && (
                  <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 24px', alignSelf: 'stretch', minHeight: 40 }} />
                )}
                <div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: 'clamp(20px,2.5vw,28px)',
                    color: '#0ae448', letterSpacing: '-0.02em',
                  }}>
                    {stat.number}
                  </div>
                  <div className="label-text" style={{ marginTop: 2, fontSize: 10 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Rotating ring + 3D */}
        <div className="hidden-mobile" style={{ position: 'relative', width: 280, height: 280, flexShrink: 0 }}>
          {/* Rotating SVG text ring */}
          <svg
            className="rotating-ring"
            viewBox="0 0 200 200"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <defs>
              <path id="circle" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
            </defs>
            <text fill="#0ae448" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="600" letterSpacing="3">
              <textPath href="#circle">DEVELOPER · QUANT · DESIGNER · FOUNDER · </textPath>
            </text>
          </svg>

          {/* 3D Torus */}
          <div style={{ position: 'absolute', inset: 30 }}>
            <TorusKnot />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}
      >
        <span className="label-text" style={{ fontSize: 10 }}>scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{ color: '#0ae448', fontSize: 18 }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
