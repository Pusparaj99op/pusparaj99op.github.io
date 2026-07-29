'use client';

import { motion } from 'framer-motion';
import KineticText from '@/components/ui/KineticText';

export default function About() {
  return (
    <section id="about" className="section-padding" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-dim)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 9fr', gap: 'clamp(24px,4vw,64px)' }} className="about-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="kicker font-mono">// about me</span>
          </motion.div>

          <div>
            <KineticText
              as="h2"
              className="font-display"
              accentWords={['Capital.']}
              style={{
                fontWeight: 800,
                fontSize: 'var(--text-display-lg)',
                color: 'var(--text-primary)',
                letterSpacing: 'var(--tracking-display)',
                lineHeight: 1.05,
                maxWidth: 700,
                marginBottom: 40,
              }}
            >
              I Build at the Intersection of Code & Capital.
            </KineticText>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-body"
              style={{ fontWeight: 300, fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}
            >
              I&apos;m Pranay Krupakar Gajbhiye &mdash; Full Stack Developer, Quant, and
              Founder of BlackObsidian (AMC) and Zorvain Street, an algorithmic
              trading company building autonomous systems for derivatives and
              crypto markets.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body"
              style={{ fontWeight: 300, fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 640, marginBottom: 40 }}
            >
              Beyond code, I&apos;m a FIDE-rated chess player, a NISM Series 8
              certified quant, and ranked AIR 7616 in JEE Advanced 2024. I
              approach every problem like a chess game &mdash; with depth,
              patience, and strategy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: 12 }}
            >
              <span className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                &#9670; BlackObsidian
              </span>
              <span className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                &#9672; Zorvain Street
              </span>
            </motion.div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
