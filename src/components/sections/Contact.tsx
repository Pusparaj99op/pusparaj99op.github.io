'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticElement from '@/components/ui/MagneticElement';

const EMAIL = 'pranaygajbhiyeofficial@gmail.com';

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/Pusparaj99op',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pranaygajbhiye/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

function FloatingInput({ label, type = 'text', rows }: { label: string; type?: string; rows?: number }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  if (rows) {
    return (
      <div className="floating-input-wrapper">
        <textarea
          rows={rows}
          className="floating-input"
          placeholder=" "
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <label className="floating-label" style={{ color: focused ? 'var(--accent)' : undefined }}>
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="floating-input-wrapper">
      <input
        type={type}
        className="floating-input"
        placeholder=" "
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label className="floating-label" style={{ color: focused ? 'var(--accent)' : undefined }}>
        {label}
      </label>
    </div>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ background: 'var(--bg-primary)', position: 'relative' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px,5vw,64px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 80, alignItems: 'start',
        }}>
          {/* LEFT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="label-text" style={{ display: 'block', marginBottom: 20 }}>// get in touch</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25,0.46,0.45,0.94] }}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(36px,5vw,64px)',
                lineHeight: 1.05, letterSpacing: '-0.04em',
                color: '#f0f0f0', marginBottom: 40,
              }}
            >
              Let&apos;s Build<br />
              Something<br />
              <span style={{ color: '#0ae448' }}>Extraordinary.</span>
            </motion.h2>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ marginBottom: 40 }}
            >
              <div className="label-text" style={{ marginBottom: 10 }}>Email</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <a
                  href={`mailto:${EMAIL}`}
                  style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 'clamp(12px,1.4vw,15px)',
                    color: '#f0f0f0', textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: 2,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0ae448')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#f0f0f0')}
                >
                  {EMAIL}
                </a>
                <button
                  onClick={copyEmail}
                  style={{
                    background: copied ? 'rgba(10,228,72,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${copied ? 'rgba(10,228,72,0.3)' : 'var(--border)'}`,
                    borderRadius: 8, padding: '6px 12px',
                    color: copied ? '#0ae448' : '#888',
                    fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: 12 }}
            >
              {socials.map(s => (
                <MagneticElement key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#888', textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget;
                      el.style.color = '#0ae448';
                      el.style.borderColor = 'rgba(10,228,72,0.3)';
                      el.style.boxShadow = '0 0 20px rgba(10,228,72,0.15)';
                      el.style.background = 'rgba(10,228,72,0.06)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget;
                      el.style.color = '#888';
                      el.style.borderColor = 'var(--border)';
                      el.style.boxShadow = 'none';
                      el.style.background = 'rgba(255,255,255,0.04)';
                    }}
                  >
                    {s.icon}
                  </a>
                </MagneticElement>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                marginTop: 48, padding: '20px 24px',
                border: '1px solid rgba(10,228,72,0.12)',
                borderRadius: 12, background: 'rgba(10,228,72,0.03)',
              }}
            >
              <div style={{
                fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#777', lineHeight: 1.7,
              }}>
                📍 <span style={{ color: '#888' }}>Nagpur, India</span>
                <span style={{ color: '#333', margin: '0 8px' }}>·</span>
                <span style={{ color: '#888' }}>Meydan Freezone, Dubai</span>
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', marginTop: 6 }}>
                Usually responds within 24 hours
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25,0.46,0.45,0.94] }}
            className="glass-card"
            style={{ padding: 'clamp(28px,4vw,40px)' }}
          >
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FloatingInput label="Name" />
                <FloatingInput label="Email" type="email" />
              </div>
              <FloatingInput label="Subject" />
              <FloatingInput label="Message" rows={5} />

              <MagneticElement strength={0.2}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    background: submitted ? 'rgba(10,228,72,0.8)' : '#0ae448',
                    color: '#000',
                    border: 'none',
                    borderRadius: 10,
                    fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600,
                    letterSpacing: '0.02em',
                    transition: 'all 0.3s ease',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {submitted ? '✓ Message Sent!' : submitting ? 'Sending...' : 'Send Message →'}
                </button>
              </MagneticElement>

              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#444', textAlign: 'center', lineHeight: 1.6 }}>
                Or email directly at{' '}
                <a href={`mailto:${EMAIL}`} style={{ color: '#0ae448', textDecoration: 'none' }}>
                  {EMAIL}
                </a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
