'use client';

import { motion } from 'framer-motion';
import KineticText from '@/components/ui/KineticText';

const BADGES = ['NISM Certified', 'FIDE Rated', 'AIR 7616', 'Meydan Freezone'];

export default function Testimonial() {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-dim)', borderBottom: '1px solid var(--border-dim)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)', textAlign: 'center' }}>
        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
          <span className="kicker">Recognized</span>
        </div>

        <KineticText
          as="blockquote"
          className="font-display"
          start="top 85%"
          style={{
            fontStyle: 'italic', fontWeight: 500,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.4,
            margin: '0 0 24px',
            borderLeft: '2px solid var(--accent-gold)',
            paddingLeft: 24,
            textAlign: 'left',
            display: 'inline-block',
          }}
        >
          &ldquo;I approach every problem like a chess game &mdash; with depth, patience, and strategy.&rdquo;
        </KineticText>

        <div className="font-mono" style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 48 }}>
          &mdash; Pranay Gajbhiye
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}
        >
          {BADGES.map(b => (
            <span key={b} className="btn-accent" style={{ display: 'inline-block' }}>{b}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
