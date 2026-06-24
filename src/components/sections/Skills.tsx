'use client';

import { motion } from 'framer-motion';

const skills = [
  {
    title: 'Core Stack',
    span: '2',
    items: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python'],
    color: '#0ae448',
    size: 'large',
  },
  { title: 'Animation', items: ['GSAP', 'Three.js', 'Framer Motion', 'WebGL'], color: '#7dd3fc', size: 'medium' },
  { title: 'Database', items: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma'], color: '#c4b5fd', size: 'medium' },
  { title: 'Design', items: ['Figma', 'Adobe XD', 'Tailwind CSS', 'Glassmorphism'], color: '#fda4af', size: 'medium' },
  { title: 'DevOps', items: ['Git', 'Docker', 'Vercel', 'GitHub Actions'], color: '#fdba74', size: 'medium' },
  {
    title: 'Algo Trading',
    items: ['Python', 'Dhan API', 'Binance API', 'MetaTrader 5', 'Black-Scholes'],
    color: '#0ae448',
    size: 'medium',
    accent: true,
  },
  {
    title: 'Always Learning',
    items: ['Rust', 'Solidity', 'ML Finance'],
    color: '#0ae448',
    size: 'small',
    pulsing: true,
  },
];

const techIcons: Record<string, string> = {
  'React': 'Re',
  'Next.js': 'Nx',
  'Node.js': 'No',
  'TypeScript': 'Ts',
  'Python': 'Py',
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="section-padding"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px,5vw,64px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <span className="label-text" style={{ display: 'block', marginBottom: 16 }}>// skills & stack</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(32px,4vw,52px)', color: '#f0f0f0',
            letterSpacing: '-0.03em',
          }}>
            Tools of the <span style={{ color: '#0ae448' }}>Trade.</span>
          </h2>
        </motion.div>

        <div className="bento-grid">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25,0.46,0.45,0.94] }}
              style={{
                gridColumn: skill.size === 'large' ? 'span 2' : 'span 1',
                background: skill.accent
                  ? 'rgba(10,228,72,0.04)'
                  : 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${skill.accent ? 'rgba(10,228,72,0.15)' : 'var(--border)'}`,
                borderRadius: 16,
                padding: skill.size === 'large' ? '32px' : '24px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: skill.size === 'small' ? 140 : skill.size === 'large' ? 200 : 180,
              }}
            >
              {/* Subtle top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 24, right: 24, height: 1,
                background: `linear-gradient(90deg, transparent, ${skill.color}40, transparent)`,
              }} />

              <div className="label-text" style={{ marginBottom: 16, color: skill.color, opacity: 0.8 }}>
                {skill.title}
              </div>

              {skill.size === 'large' ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {skill.items.map(item => (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.06, boxShadow: `0 0 20px ${skill.color}30` }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 18px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'none',
                      }}
                    >
                      {techIcons[item] && (
                        <span style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: `${skill.color}15`,
                          border: `1px solid ${skill.color}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'Syne, sans-serif', fontWeight: 700,
                          fontSize: 10, color: skill.color,
                        }}>
                          {techIcons[item]}
                        </span>
                      )}
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#d0d0d0', fontWeight: 500 }}>
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : skill.pulsing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="pulse-dot" />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#666' }}>Currently exploring</span>
                  </div>
                  {skill.items.map((item, j) => (
                    <motion.span
                      key={item}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: j * 0.6 }}
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#0ae448',
                        padding: '4px 10px', borderRadius: 6,
                        background: 'rgba(10,228,72,0.06)',
                        display: 'inline-block', width: 'fit-content',
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {skill.items.map(item => (
                    <div key={item} style={{
                      fontFamily: 'Inter, sans-serif', fontSize: 13,
                      color: '#bbb', display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: skill.color, display: 'inline-block', flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
