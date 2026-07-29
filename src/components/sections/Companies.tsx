'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionBadge from '@/components/ui/SectionBadge';
import StackPill from '@/components/ui/StackPill';

const VENTURES = [
  {
    index: '01',
    name: 'BlackObsidian (AMC)',
    category: 'Asset Management Company',
    description: 'Building investment infrastructure and systematic portfolio strategies for the next generation of capital.',
    tags: ['Portfolio Strategy', 'Systematic Investing', 'Asset Management', 'Quantitative Models'],
    href: undefined as string | undefined,
  },
  {
    index: '02',
    name: 'Zorvain Street',
    category: 'Algorithmic Trading',
    description: 'Autonomous trading systems for Nifty 50 derivatives, XAUUSD, crypto options — powered by quantitative models.',
    tags: ['Algo Trading', 'XAUUSD', 'Derivatives', 'HFT'],
    href: 'https://zorvainsteet-com.vercel.app/',
  },
];

function AccordionItem({ venture, isOpen, onToggle }: { venture: typeof VENTURES[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-dim)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 0', background: 'none', border: 'none', cursor: 'inherit', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <span className="font-mono" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{venture.index}</span>
          <span className="font-display" style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            {venture.name}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: 20, color: 'var(--accent-gold)', flexShrink: 0 }}
        >
          +
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ paddingBottom: 32 }}>
          <div className="label-text" style={{ marginBottom: 12 }}>{venture.category}</div>
          <p className="font-body" style={{ fontWeight: 300, fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 600, marginBottom: 20 }}>
            {venture.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: venture.href ? 20 : 0 }}>
            {venture.tags.map(tag => <StackPill key={tag} label={tag} />)}
          </div>
          {venture.href && (
            <a
              href={venture.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-gold)', fontSize: 14, textDecoration: 'none' }}
            >
              Visit site <span className="arrow-icon">&#8599;</span>
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Companies() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="ventures" ref={sectionRef} className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
        <SectionBadge id="PG — 03" label="Ventures" />

        <p className="font-body" style={{ fontWeight: 300, fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, marginBottom: 48 }}>
          Superior quant systems for the next generation of markets.
        </p>

        <div style={{ borderTop: '1px solid var(--border-dim)' }}>
          {VENTURES.map((venture, i) => (
            <AccordionItem
              key={venture.name}
              venture={venture}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
