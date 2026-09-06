'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import MagneticElement from '@/components/ui/MagneticElement';
import GlassTiles from '@/components/ui/GlassTiles';

const HeroBackground = dynamic(() => import('@/components/ui/HeroBackground'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    setShowParticles(
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.innerWidth > 768
    );
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lines = headlineRef.current?.querySelectorAll('.hero-line');
    if (!lines) return;
    gsap.set(headlineRef.current, { perspective: 700 });

    const tl = gsap.timeline({ delay: 0.5 });
    let wordIndex = 0;
    lines.forEach((line, i) => {
      const words = line.querySelectorAll('.word');
      words.forEach((word, j) => {
        const variant = wordIndex % 4;
        wordIndex++;
        if (variant === 0) {
          tl.fromTo(word,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
            i * 0.1 + j * 0.06
          );
        } else if (variant === 1) {
          tl.fromTo(word,
            { scale: 0.55, opacity: 0, filter: 'blur(12px)' },
            { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'back.out(2)' },
            i * 0.1 + j * 0.06
          );
        } else if (variant === 2) {
          tl.fromTo(word,
            { x: -40, skewX: -12, opacity: 0 },
            { x: 0, skewX: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
            i * 0.1 + j * 0.06
          );
        } else {
          tl.fromTo(word,
            { rotateX: 85, y: 24, opacity: 0, transformOrigin: '50% 100%' },
            { rotateX: 0, y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
            i * 0.1 + j * 0.06
          );
        }
      });
    });
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh',
        position: 'relative',
        display: 'grid',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      <GlassTiles rows={5} cols={8} />
      {showParticles && <HeroBackground />}

      {/* Corner badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="kicker"
        style={{ position: 'absolute', top: 96, left: 'clamp(24px,5vw,80px)', zIndex: 2 }}
      >
        Founder &middot; Developer &middot; Quant Trader
      </motion.div>

      {/* Bottom-right label */}
      <div
        className="font-mono hidden-mobile"
        style={{
          position: 'absolute', bottom: 40, right: 'clamp(24px,5vw,80px)', zIndex: 2,
          fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.05em',
        }}
      >
        PG &middot; NGP &middot; 2025
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto', width: '100%',
        padding: '160px clamp(24px,5vw,80px) 80px', position: 'relative', zIndex: 1,
      }}>
        <div ref={headlineRef} className="giant-type" style={{ fontSize: 'var(--text-display-xl)', color: 'var(--text-primary)', marginBottom: 40 }}>
          <div className="hero-line" style={{ overflow: 'visible', paddingBottom: '0.1em' }}>
            {['Building', 'systems'].map((w, i) => (
              <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.22em', willChange: 'transform, opacity, filter' }}>{w}</span>
            ))}
          </div>
          <div className="hero-line" style={{ overflow: 'visible', fontStyle: 'italic', fontWeight: 700, paddingBottom: '0.1em' }}>
            {['that', 'trade,'].map((w, i) => (
              <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.22em', willChange: 'transform, opacity, filter' }}>{w}</span>
            ))}
          </div>
          <div className="hero-line" style={{ overflow: 'visible', paddingBottom: '0.1em' }}>
            {['scale', '&', 'inspire.'].map((w, i) => (
              <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.22em', willChange: 'transform, opacity, filter' }}>{w}</span>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="font-body"
          style={{ fontWeight: 300, fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.65, marginBottom: 40 }}
        >
          Full stack developer and quantitative trader crafting algorithmic
          systems, premium digital products, and scalable web experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}
        >
          <MagneticElement>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-ghost"
              style={{ padding: '14px 32px', fontSize: 14, display: 'inline-block', textDecoration: 'none' }}
            >
              <span className="btn-label">Start a Project &darr;</span>
            </a>
          </MagneticElement>
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="font-body"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, textDecoration: 'none',
            }}
          >
            View Work <span className="arrow-icon">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
