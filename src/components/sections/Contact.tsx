'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticElement from '@/components/ui/MagneticElement';
import SectionBadge from '@/components/ui/SectionBadge';
import KineticText from '@/components/ui/KineticText';

const EMAIL = 'pranaygajbhiyeofficial@gmail.com';

const socials = [
  { label: 'GitHub', href: 'https://github.com/Pusparaj99op' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pranaygajbhiye/' },
];

function FloatingInput({ label, type = 'text', rows }: { label: string; type?: string; rows?: number }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const shared = {
    className: 'floating-input',
    placeholder: ' ',
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  return (
    <div className="floating-input-wrapper">
      {rows ? <textarea rows={rows} {...shared} /> : <input type={type} {...shared} />}
      <label className="floating-label" style={{ color: focused ? 'var(--accent-gold)' : undefined }}>
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
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
        <SectionBadge id="PG — 08" label="Get in Touch" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 80, alignItems: 'start',
        }}>
          {/* LEFT */}
          <div>
            <KineticText
              as="h2"
              className="font-display"
              accentWords={['Extraordinary.']}
              style={{
                fontWeight: 900,
                fontSize: 'var(--text-display-lg)',
                lineHeight: 1.05, letterSpacing: 'var(--tracking-display)',
                color: 'var(--text-primary)', marginBottom: 40,
                maxWidth: 480,
              }}
            >
              Let&apos;s Build Something Extraordinary.
            </KineticText>

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
                  className="font-body"
                  style={{
                    fontSize: 'clamp(12px,1.4vw,15px)',
                    color: 'var(--text-primary)', textDecoration: 'none',
                    borderBottom: '1px solid var(--border-mid)',
                    paddingBottom: 2,
                  }}
                >
                  {EMAIL}
                </a>
                <button
                  onClick={copyEmail}
                  className="font-mono"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${copied ? 'var(--accent-gold)' : 'var(--border-dim)'}`,
                    padding: '6px 12px',
                    color: copied ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                    fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}
            >
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 15,
                  }}
                >
                  {s.label} <span className="arrow-icon">&rarr;</span>
                </a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ borderTop: '1px solid var(--border-dim)', paddingTop: 20 }}
            >
              <div className="font-body" style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Nagpur, India
                <span style={{ color: 'var(--text-tertiary)', margin: '0 8px' }}>&middot;</span>
                Meydan Freezone, Dubai
              </div>
              <div className="font-body" style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
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
          >
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <FloatingInput label="Name" />
                <FloatingInput label="Email" type="email" />
              </div>
              <FloatingInput label="Subject" />
              <FloatingInput label="Message" rows={4} />

              <MagneticElement strength={0.2}>
                <button
                  type="submit"
                  className="btn-ghost"
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    marginTop: 24,
                    fontFamily: 'var(--font-body)', fontSize: 15,
                    letterSpacing: '0.02em',
                    borderRadius: 0,
                  }}
                >
                  {submitted ? 'Message Sent' : submitting ? 'Sending...' : 'Send Message →'}
                </button>
              </MagneticElement>

              <p className="font-body" style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.6, marginTop: 12 }}>
                Or email directly at{' '}
                <a href={`mailto:${EMAIL}`} style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>
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
