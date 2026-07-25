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
        minHeight: '100dvh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
        maxWidth: 1120, margin: '0 auto',
        padding: '140px clamp(24px,5vw,64px) 0',
        width: '100%', position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="label-text"
          style={{ color: '#555', marginBottom: 28 }}
        >
          Founder, BlackObsidian &amp; Zorvain Street
        </motion.span>

        {/* Headline */}
        <div
          ref={headlineRef}
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: 'clamp(2.75rem, 6vw, 5.25rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#f0f0f0',
            marginBottom: 32,
            overflow: 'hidden',
            maxWidth: 900,
          }}
        >
          {['Building', 'systems', 'that', 'trade,', 'scale', '&', 'inspire.'].map((word, i) => (
            <span
              key={i}
              className="word"
              style={{
                display: 'inline-block',
                marginRight: '0.22em',
                color: word === '&' || word === 'inspire.' ? '#0ae448' : '#f0f0f0',
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.7 }}
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: 'clamp(15px,1.4vw,18px)',
            color: '#888', lineHeight: 1.6, maxWidth: 540, marginBottom: 40,
          }}
        >
          Full stack developer and quantitative trader crafting algorithmic
          systems, premium digital products, and scalable web experiences.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 96 }}
        >
          <MagneticElement>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-accent"
              style={{ padding: '14px 32px', fontSize: 15, display: 'inline-block', textDecoration: 'none' }}
            >
              Start a Project
            </a>
          </MagneticElement>
          <MagneticElement>
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-ghost"
              style={{ padding: '13px 30px', fontSize: 15, display: 'inline-block', textDecoration: 'none' }}
            >
              <span className="btn-label">View Work</span>
            </a>
          </MagneticElement>
        </motion.div>

        {/* Centered ring + 3D accent */}
        <div className="hidden-mobile" style={{ position: 'relative', width: 220, height: 220 }}>
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
          <div style={{ position: 'absolute', inset: 24 }}>
            <TorusKnot />
          </div>
        </div>
      </div>

      {/* Stat strip — sits below the hero moment, not inside it */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap',
          padding: '32px clamp(24px,5vw,64px) 48px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 32,
        }}
      >
        {stats.map((stat, i) => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'stretch' }}>
            {i > 0 && (
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 32px', alignSelf: 'stretch', minHeight: 40 }} />
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 'clamp(18px,2vw,24px)',
                color: '#0ae448', letterSpacing: '-0.02em',
              }}>
                {stat.number}
              </div>
              <div className="label-text" style={{ marginTop: 4, fontSize: 10 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
