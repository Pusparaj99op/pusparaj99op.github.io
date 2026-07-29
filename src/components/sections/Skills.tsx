'use client';

import { motion } from 'framer-motion';
import SectionBadge from '@/components/ui/SectionBadge';
import KineticText from '@/components/ui/KineticText';

const STACK: Record<string, string[]> = {
  'Core Stack': ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python'],
  'Animation': ['GSAP', 'Three.js', 'Framer Motion', 'WebGL'],
  'Database': ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma'],
  'Design': ['Figma', 'Tailwind CSS', 'Adobe XD'],
  'DevOps': ['Git', 'Docker', 'Vercel', 'GitHub Actions'],
  'Algo Trading': ['Dhan API', 'Binance API', 'MetaTrader 5', 'Black-Scholes'],
};

export default function Skills() {
  return (
    <section id="skills" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
        <SectionBadge id="PG — 05" label="Skills & Stack" />

        <KineticText
          as="h2"
          className="font-display"
          accentWords={['Trade.']}
          style={{
            fontWeight: 800, fontSize: 'var(--text-display-lg)', color: 'var(--text-primary)',
            letterSpacing: 'var(--tracking-display)', marginBottom: 64,
          }}
        >
          Tools of the Trade.
        </KineticText>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 40px' }} className="skills-grid">
          {Object.entries(STACK).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-mono" style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)',
                color: 'var(--text-tertiary)', marginBottom: 12,
              }}>
                {category}
              </div>
              <div style={{ borderBottom: '1px solid var(--border-dim)', marginBottom: 16 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <span key={item} className="font-body" style={{ fontWeight: 400, fontSize: 14, color: 'var(--text-secondary)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 1024px) { .skills-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .skills-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
