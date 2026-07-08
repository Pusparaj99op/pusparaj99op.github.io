'use client';

import { motion } from 'framer-motion';

const companies = [
  {
    name: 'BlackObsidian',
    subtitle: 'Asset Management Company',
    description: 'Building investment infrastructure and systematic portfolio strategies for the next generation of capital.',
    tags: ['AMC', 'Portfolio Strategy', 'Systematic Investing'],
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polygon points="24,4 44,36 4,36" stroke="#0ae448" strokeWidth="1.5" fill="rgba(10,228,72,0.06)" />
        <polygon points="24,14 36,34 12,34" stroke="#0ae448" strokeWidth="1" fill="rgba(10,228,72,0.04)" opacity="0.7" />
        <circle cx="24" cy="24" r="3" fill="#0ae448" />
      </svg>
    ),
    bg: 'radial-gradient(ellipse at 20% 50%, rgba(10,228,72,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,0,0,0.8) 0%, transparent 50%)',
  },
  {
    name: 'Zorvain Street',
    subtitle: 'Algorithmic Trading',
    description: 'Autonomous trading systems for Nifty 50 derivatives, XAUUSD, crypto options — powered by quantitative models.',
    tags: ['Algo Trading', 'XAUUSD', 'Derivatives', 'HFT'],
    href: 'https://zorvainsteet-com.vercel.app/',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polyline points="4,36 14,20 20,28 28,14 36,24 44,10" stroke="#0ae448" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="44" cy="10" r="3" fill="#0ae448" />
        <line x1="4" y1="40" x2="44" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </svg>
    ),
    bg: 'radial-gradient(ellipse at 80% 30%, rgba(10,228,72,0.05) 0%, transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.01) 0%, transparent 100%)',
  },
];

export default function Companies() {
  return (
    <section
      id="ventures"
      className="section-padding"
      style={{
        background: 'var(--bg-secondary)',
        position: 'relative',
      }}
    >
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px,5vw,64px)', position: 'relative' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64, textAlign: 'center' }}
        >
          <span className="label-text" style={{ display: 'block', marginBottom: 16 }}>{'// ventures'}</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(32px,4vw,52px)', color: '#f0f0f0',
            letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Founded. Built. <span style={{ color: '#0ae448' }}>Operating.</span>
          </h2>
        </motion.div>

        {/* Company cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {companies.map((company, i) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25,0.46,0.45,0.94] }}
              whileHover={{ y: -4 }}
              data-cursor-card
              style={{
                background: company.bg,
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: 'clamp(32px, 4vw, 48px)',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 'clamp(24px, 4vw, 48px)',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                cursor: 'none',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(10,228,72,0.3)';
                el.style.boxShadow = '0 8px 60px rgba(10,228,72,0.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--border)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Large background number */}
              <div style={{
                position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(80px,12vw,160px)',
                color: 'rgba(255,255,255,0.02)',
                lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div style={{
                width: 80, height: 80,
                borderRadius: 16,
                background: 'rgba(10,228,72,0.05)',
                border: '1px solid rgba(10,228,72,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {company.icon}
              </div>

              {/* Content */}
              <div>
                <div className="label-text" style={{ marginBottom: 8, color: '#0ae448', opacity: 0.7 }}>
                  {company.subtitle}
                </div>
                {company.href ? (
                  <a
                    href={company.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${company.name}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <h3 style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 800,
                      fontSize: 'clamp(24px, 3vw, 36px)',
                      color: '#f0f0f0', letterSpacing: '-0.02em', marginBottom: 12,
                    }}>
                      {company.name}
                    </h3>
                  </a>
                ) : (
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    color: '#f0f0f0', letterSpacing: '-0.02em', marginBottom: 12,
                  }}>
                    {company.name}
                  </h3>
                )}
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 15,
                  color: '#777', lineHeight: 1.7, maxWidth: 500, marginBottom: 20,
                }}>
                  {company.description}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {company.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '4px 12px',
                      borderRadius: 9999,
                      background: 'rgba(10,228,72,0.06)',
                      border: '1px solid rgba(10,228,72,0.15)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 11, fontWeight: 600,
                      color: '#0ae448', letterSpacing: '0.06em',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              {company.href ? (
                <a
                  className="hidden-mobile"
                  href={company.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${company.name}`}
                  style={{
                    width: 48, height: 48, borderRadius: '50%',
                    border: '1px solid rgba(10,228,72,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0ae448', fontSize: 18, flexShrink: 0,
                    textDecoration: 'none',
                  }}
                >
                  ↗
                </a>
              ) : (
                <div className="hidden-mobile" style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: '1px solid rgba(10,228,72,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0ae448', fontSize: 18, flexShrink: 0,
                }}>
                  ↗
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
