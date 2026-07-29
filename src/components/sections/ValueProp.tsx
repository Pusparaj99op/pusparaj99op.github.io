'use client';

import { motion } from 'framer-motion';
import KineticText from '@/components/ui/KineticText';

export default function ValueProp() {
  return (
    <section style={{ background: 'var(--bg-primary)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
        <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: 40 }} />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(24px,4vw,64px)',
          alignItems: 'start',
        }} className="valueprop-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65 }}
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
          >
            <span className="kicker">Systems. Code. Capital.</span>
            <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>(PG &mdash; 01)</span>
          </motion.div>
          <KineticText
            as="p"
            className="font-body"
            accentWords={['execution.']}
            style={{ fontWeight: 300, fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.65 }}
          >
            Get elite quant infrastructure and full-stack engineering in one founder. No bloat. No hand-holding. Pure execution.
          </KineticText>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .valueprop-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
