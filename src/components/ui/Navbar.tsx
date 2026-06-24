'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const onScroll = () => setScrolled(window.scrollY > 80);
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
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.8 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '0 clamp(24px, 5vw, 64px)',
          height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Monogram */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 24, color: '#0ae448',
            letterSpacing: '-0.02em',
            background: 'none', border: 'none', padding: 0,
          }}
        >
          PG
        </button>

        {/* Desktop links */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: 40 }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="nav-link"
              style={{
                background: 'none', border: 'none',
                color: '#f0f0f0', fontFamily: 'Inter, sans-serif',
                fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
                padding: '4px 0',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            className="hidden-mobile"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 9999,
              border: '1px solid rgba(10,228,72,0.25)',
              background: 'rgba(10,228,72,0.05)',
            }}
          >
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#0ae448', fontWeight: 500 }}>
              Open to Work
            </span>
          </div>

          <button
            onClick={() => scrollTo('#contact')}
            className="btn-accent hidden-mobile"
            style={{ padding: '9px 22px', fontSize: 13 }}
          >
            Hire Me
          </button>

          {/* Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(v => !v)}
            style={{ background: 'none', border: 'none', padding: 4, flexDirection: 'column', gap: 5 }}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              style={{ display: 'block', width: 24, height: 1.5, background: '#f0f0f0', transformOrigin: 'center' }} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
              style={{ display: 'block', width: 24, height: 1.5, background: '#f0f0f0' }} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              style={{ display: 'block', width: 24, height: 1.5, background: '#f0f0f0', transformOrigin: 'center' }} />
          </button>
        </div>
      </motion.nav>

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
              background: '#050505', zIndex: 999,
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
                style={{
                  background: 'none', border: 'none',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  fontSize: 'clamp(36px, 10vw, 56px)',
                  color: '#f0f0f0', letterSpacing: '-0.03em',
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
              style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: 14 }}
            >
              pranaygajbhiyeofficial@gmail.com
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
