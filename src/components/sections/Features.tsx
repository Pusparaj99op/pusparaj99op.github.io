'use client';

import { motion } from 'framer-motion';

const FEATURES = [
  {
    title: 'Quant Systems',
    body: 'Autonomous algo trading systems for derivatives, crypto, XAUUSD.',
  },
  {
    title: 'Full-Stack Dev',
    body: 'End-to-end web products with GSAP, Three.js, and Next.js.',
  },
  {
    title: 'Founder Mode',
    body: 'Two operating ventures. Real capital. Real systems.',
  },
];

export default function Features() {
  return (
    <section style={{ background: 'var(--bg-primary)', padding: '60px 0 100px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }} className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="card-tilt-hover"
              style={{
                border: '1px solid var(--border-dim)',
                padding: 32,
                marginLeft: i === 0 ? 0 : -1,
              }}
            >
              <span style={{ color: 'var(--accent-gold)', fontSize: 10, display: 'block', marginBottom: 16 }}>&#9679;</span>
              <h3 className="font-display" style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 12 }}>
                {f.title}
              </h3>
              <p className="font-body" style={{ fontWeight: 300, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .features-grid > div { margin-left: 0 !important; margin-top: -1px; }
        }
      `}</style>
    </section>
  );
}
