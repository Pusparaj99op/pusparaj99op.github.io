'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSurface from './GlassSurface';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Ventures', href: '#ventures' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 64,
        }}
      >
        <GlassSurface
          width="100%"
          height={64}
          borderRadius={0}
          backgroundOpacity={scrolled ? 0.5 : 0}
          saturation={1.4}
          blur={8}
          displace={scrolled ? 2 : 0}
          distortionScale={-120}
          style={{
            borderBottom: scrolled ? '1px solid var(--border-dim)' : '1px solid transparent',
            transition: 'border-color 0.4s ease',
          }}
        >
        <div style={{
          width: '100%', height: '100%',
          padding: '0 clamp(24px, 5vw, 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
        {/* Monogram */}
        <motion.button
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display"
          style={{
            fontStyle: 'italic', fontWeight: 700,
            fontSize: '1.5rem', color: 'var(--accent-gold)',
            background: 'none', border: 'none', padding: 0,
          }}
        >
          PG
        </motion.button>

        {/* Desktop links */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: 40 }}>
          {NAV_LINKS.map((link, i) => (
            <motion.button
              key={link.label}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28 + i * 0.08 }}
              onClick={() => scrollTo(link.href)}
              className="nav-link font-body"
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-secondary)',
                fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
                padding: '4px 0', transition: 'color 200ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {link.label}
            </motion.button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <motion.button
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={() => scrollTo('#contact')}
            className="btn-accent hidden-mobile"
          >
            Hire Me &rarr;
          </motion.button>

          {/* Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(v => !v)}
            style={{ background: 'none', border: 'none', padding: 4, flexDirection: 'column', gap: 5 }}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              style={{ display: 'block', width: 24, height: 1.5, background: 'var(--text-primary)', transformOrigin: 'center' }} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
              style={{ display: 'block', width: 24, height: 1.5, background: 'var(--text-primary)' }} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              style={{ display: 'block', width: 24, height: 1.5, background: 'var(--text-primary)', transformOrigin: 'center' }} />
          </button>
        </div>
        </div>
        </GlassSurface>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
            exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed', inset: 0,
              background: 'var(--bg-primary)', zIndex: 999,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 40,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                onClick={() => scrollTo(link.href)}
                className="font-display"
                style={{
                  background: 'none', border: 'none',
                  fontWeight: 700,
                  fontSize: 'clamp(36px, 10vw, 56px)',
                  color: 'var(--text-primary)', letterSpacing: 'var(--tracking-display)',
                }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              href="mailto:pranaygajbhiyeofficial@gmail.com"
              className="font-body"
              style={{ color: 'var(--text-secondary)', fontSize: 14 }}
            >
              pranaygajbhiyeofficial@gmail.com
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
