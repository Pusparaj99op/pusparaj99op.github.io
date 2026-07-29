'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects, type Project } from '@/data/projects';
import SectionBadge from '@/components/ui/SectionBadge';
import StackPill from '@/components/ui/StackPill';

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.07 }}
      className="project-row"
      style={{ borderBottom: '1px solid var(--border-dim)' }}
    >
      <Link href={`/projects/${project.slug}/`} style={{ display: 'block', textDecoration: 'none', padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 10 }}>
          <span className="font-mono" style={{ fontSize: 13, color: 'var(--text-tertiary)', width: 32, flexShrink: 0 }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-display" style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            {project.title}
          </span>
          <span className="font-mono" style={{
            fontSize: 10, color: 'var(--text-tertiary)', border: '1px solid var(--border-dim)',
            padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {project.category}
          </span>
          <span className="arrow-icon" style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }}>&rarr;</span>
        </div>
        <p className="font-body" style={{
          fontWeight: 300, fontSize: 14, color: 'var(--text-secondary)',
          maxWidth: 620, marginLeft: 56, marginBottom: 12,
        }}>
          {project.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginLeft: 56 }}>
          {project.tags.map(tag => <StackPill key={tag} label={tag} />)}
        </div>
      </Link>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      style={{ background: 'var(--bg-primary)', position: 'relative' }}
      className="section-padding"
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
        <SectionBadge id="PG — 04" label="Systems I've Built" />

        <div style={{ borderTop: '1px solid var(--border-dim)' }}>
          {projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
