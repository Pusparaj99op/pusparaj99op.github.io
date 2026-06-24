'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: '01',
    title: 'NiftyOptionTradingSystem',
    category: 'Algo Trading',
    description: 'Autonomous Nifty 50 derivative trading system with real-time options analysis and position management.',
    tags: ['Python', 'Dhan API', 'Options', 'Automation'],
    accent: '#0ae448',
    github: 'https://github.com/Pusparaj99op/NiftyOptionTradingSystem',
  },
  {
    id: '02',
    title: 'BinanceEthereumOptionAlgo',
    category: 'FinTech',
    description: 'Binance ETH options algorithm with dynamic hedging strategies and real-time Greeks calculation.',
    tags: ['Python', 'Binance API', 'Crypto', 'Makefile'],
    accent: '#7dd3fc',
    github: 'https://github.com/Pusparaj99op/BinanceEthereumOptionAlgo',
  },
  {
    id: '03',
    title: 'Tradeform',
    category: 'Full Stack',
    description: 'MetaTrader 5 integrated AI-powered trading platform with backtesting and live execution modules.',
    tags: ['Python', 'MT5', 'AI', 'Dashboard'],
    accent: '#c4b5fd',
    github: 'https://github.com/Pusparaj99op/Tradeform',
  },
  {
    id: '04',
    title: 'BlackScholes on Bitcoin',
    category: 'Quant Finance',
    description: 'Black-Scholes-Merton model applied to Bitcoin options pricing with implied volatility surface.',
    tags: ['Python', 'BSM Model', 'Bitcoin', 'Math'],
    accent: '#fde68a',
    github: 'https://github.com/Pusparaj99op',
  },
  {
    id: '05',
    title: 'CRYPTO',
    category: 'Algo Trading',
    description: 'Multi-exchange crypto algorithmic trading system with portfolio rebalancing and risk management.',
    tags: ['Python', 'Crypto', 'Multi-exchange', 'Risk'],
    accent: '#fb923c',
    github: 'https://github.com/Pusparaj99op/CRYPTO',
  },
  {
    id: '06',
    title: 'Open Terminal',
    category: 'Full Stack',
    description: 'Web-based terminal emulator with real-time canvas rendering, command history, and custom shell.',
    tags: ['JavaScript', 'Canvas', 'GSAP', 'Shell'],
    accent: '#34d399',
    github: 'https://github.com/Pusparaj99op',
  },
];

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-8deg', '8deg']);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-card
      style={{
        width: 'clamp(320px, 28vw, 420px)',
        height: 520,
        flexShrink: 0,
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          width: '100%', height: '100%',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 32,
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
          cursor: 'none',
        }}
        onMouseEnter={e => {
          const top = (e.currentTarget.querySelector('.accent-line') as HTMLElement);
          if (top) top.style.boxShadow = `0 0 20px ${project.accent}`;
        }}
        onMouseLeave={e => {
          const top = (e.currentTarget.querySelector('.accent-line') as HTMLElement);
          if (top) top.style.boxShadow = 'none';
        }}
      >
        {/* Top accent line */}
        <div
          className="accent-line"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: project.accent,
            transition: 'box-shadow 0.3s ease',
          }}
        />

        {/* Background number */}
        <div style={{
          position: 'absolute', bottom: -10, right: 16,
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: '5rem', color: 'rgba(255,255,255,0.03)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>
          {project.id}
        </div>

        {/* Category badge */}
        <span style={{
          alignSelf: 'flex-start',
          padding: '4px 12px', borderRadius: 9999,
          background: `${project.accent}15`,
          border: `1px solid ${project.accent}30`,
          fontFamily: 'Inter, sans-serif',
          fontSize: 10, fontWeight: 600,
          color: project.accent, letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 'auto',
        }}>
          {project.category}
        </span>

        {/* Number */}
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: 13, color: project.accent, opacity: 0.6,
          letterSpacing: '0.1em', marginBottom: 12, marginTop: 24,
        }}>
          {project.id}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: 'clamp(18px, 1.8vw, 22px)',
          color: '#f0f0f0', letterSpacing: '-0.02em',
          lineHeight: 1.2, marginBottom: 16,
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 13,
          color: '#777', lineHeight: 1.75, marginBottom: 24, flexGrow: 1,
        }}>
          {project.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px', borderRadius: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#888',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#666', fontFamily: 'Inter, sans-serif', fontSize: 12,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = project.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = '#666')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: project.accent, fontFamily: 'Inter, sans-serif',
              fontSize: 12, fontWeight: 600, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            View Project ↗
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDist = trackWidth - viewportWidth + 120;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollDist,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${scrollDist + 400}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(80px,8vw,120px) clamp(24px,5vw,64px) 60px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="label-text" style={{ display: 'block', marginBottom: 16 }}>// projects</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(32px,4vw,52px)', color: '#f0f0f0',
            letterSpacing: '-0.03em',
          }}>
            Systems I&apos;ve <span style={{ color: '#0ae448' }}>Built.</span>
          </h2>
        </motion.div>
      </div>

      {/* Horizontal scroll */}
      <div style={{ padding: '0 clamp(24px,5vw,64px) clamp(80px,8vw,120px)' }}>
        <div
          ref={trackRef}
          style={{ display: 'flex', gap: 24, width: 'max-content', alignItems: 'center' }}
        >
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
