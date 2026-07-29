'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Project, ProjectFeatureTag } from '@/data/projects';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import GlassSurface from '@/components/ui/GlassSurface';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const FILTERS: ('All' | ProjectFeatureTag)[] = ['All', 'Architecture', 'Automation', 'Interface', 'Data'];

function Toolbar({ title, github }: { title: string; github: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : -16 }}
      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      style={{
        position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
        zIndex: 900, width: 'min(680px, calc(100vw - 48px))',
        pointerEvents: scrolled ? 'auto' : 'none',
      }}
    >
      <GlassSurface
        width="100%"
        height={56}
        borderRadius={999}
        backgroundOpacity={0.4}
        saturation={1.4}
        blur={8}
        displace={2}
        distortionScale={-120}
        style={{ border: '1px solid var(--border-mid)' }}
      >
        <div style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px',
        }}>
          <Link
            href="/#projects"
            className="font-body"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', flexShrink: 0,
            }}
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            All Work
          </Link>
          <span className="font-display" style={{
            fontWeight: 600, fontSize: 14, color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            padding: '0 16px', flex: 1, textAlign: 'center',
          }}>
            {title}
          </span>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--accent-gold)', fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '0.08em', textDecoration: 'none', flexShrink: 0,
            }}
          >
            GitHub <ArrowUpRight size={13} strokeWidth={1.75} />
          </a>
        </div>
      </GlassSurface>
    </motion.div>
  );
}

export default function CaseStudy({ project, related }: { project: Project; related: Project[] }) {
  const [filter, setFilter] = useState<'All' | ProjectFeatureTag>('All');
  const visibleGallery = filter === 'All' ? project.gallery : project.gallery.filter(g => g.tag === filter);
  const availableFilters = FILTERS.filter(f => f === 'All' || project.gallery.some(g => g.tag === f));

  const heroWrapRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Phantom.land-style hero: clip-path wipe reveal on load, then a slow
  // parallax drift on the image as the hero scrolls past.
  useEffect(() => {
    const wrap = heroWrapRef.current;
    const img = heroImgRef.current;
    if (!wrap || !img) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.set(wrap, { clipPath: 'inset(0 0 100% 0)' });
      gsap.set(img, { scale: 1.25, yPercent: 6 });
      gsap.timeline({ delay: 0.15 })
        .to(wrap, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut' })
        .to(img, { scale: 1, duration: 1.3, ease: 'power3.out' }, 0.1);

      gsap.to(img, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  // Gallery: clip-path stagger reveal, re-bound whenever the visible set changes.
  useEffect(() => {
    const grid = galleryRef.current;
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = gsap.utils.toArray<HTMLElement>('.gallery-item', grid);
    const ctx = gsap.context(() => {
      items.forEach(item => {
        const img = item.querySelector('img');
        gsap.fromTo(item,
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power4.inOut',
            scrollTrigger: { trigger: item, start: 'top 90%' },
          }
        );
        if (img) {
          gsap.fromTo(img,
            { scale: 1.15 },
            {
              scale: 1, duration: 1.1, ease: 'power3.out',
              scrollTrigger: { trigger: item, start: 'top 90%' },
            }
          );
        }
      });
    }, grid);

    return () => ctx.revert();
  }, [filter]);

  return (
    <>
      <Navbar />
      <Toolbar title={project.title} github={project.github} />
      <main style={{ background: 'var(--bg-primary)' }}>
        {/* Back nav + live link row */}
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(96px,12vw,140px) clamp(24px,5vw,80px) 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <Link
            href="/#projects"
            className="font-body"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--text-secondary)', fontSize: 14,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
            All Work
          </Link>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ padding: '10px 22px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
          >
            <span className="btn-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </span>
          </a>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: 1280, margin: '0 auto',
            padding: 'clamp(32px,4vw,56px) clamp(24px,5vw,80px) 0',
          }}
        >
          <span className="label-text" style={{ display: 'block', marginBottom: 16 }}>
            {project.category}
          </span>
          <h1 className="font-display" style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            lineHeight: 1.05, letterSpacing: 'var(--tracking-display)',
            color: 'var(--text-primary)', maxWidth: 900, marginBottom: 40,
          }}>
            {project.title}
          </h1>

          <div
            ref={heroWrapRef}
            style={{
              position: 'relative', aspectRatio: '16 / 9', borderRadius: 4,
              overflow: 'hidden', border: '1px solid var(--border-dim)',
            }}
          >
            <img
              ref={heroImgRef}
              src={`https://picsum.photos/seed/${project.seed}/1800/1013`}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }}
            />
          </div>
        </motion.div>

        {/* Meta strip */}
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(32px,4vw,48px) clamp(24px,5vw,80px)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 24, borderBottom: '1px solid var(--border-dim)',
        }}>
          {[
            { label: 'Role', value: project.role },
            { label: 'Year', value: project.year },
            { label: 'Category', value: project.category },
            { label: 'Stack', value: project.stack.slice(0, 2).join(', ') },
          ].map(item => (
            <div key={item.label}>
              <div className="label-text" style={{ marginBottom: 6 }}>{item.label}</div>
              <div className="font-body" style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(56px,7vw,96px) clamp(24px,5vw,80px)',
          display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(32px,5vw,64px)',
        }}
          className="overview-grid"
        >
          <div className="label-text">Overview</div>
          <div>
            {project.overview.map((para, i) => (
              <p key={i} className="font-body" style={{
                fontWeight: 300, fontSize: 17, color: 'var(--text-secondary)',
                lineHeight: 1.85, maxWidth: 680, marginBottom: i === project.overview.length - 1 ? 0 : 24,
              }}>
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 clamp(24px,5vw,80px) clamp(56px,7vw,96px)',
          display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(32px,5vw,64px)',
        }}
          className="overview-grid"
        >
          <div className="label-text">Highlights</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {project.highlights.map((h, i) => (
              <motion.div
                key={h}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                style={{
                  display: 'flex', gap: 24, alignItems: 'baseline',
                  padding: '20px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border-dim)',
                }}
              >
                <span className="font-mono" style={{
                  fontWeight: 700, fontSize: 13,
                  color: 'var(--accent-gold)', flexShrink: 0, minWidth: 24,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-body" style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {h}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature gallery with filters */}
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 clamp(24px,5vw,80px) clamp(80px,10vw,120px)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20, marginBottom: 40,
          }}>
            <h2 className="font-display" style={{
              fontWeight: 700, fontSize: 'clamp(24px,2.6vw,34px)',
              color: 'var(--text-primary)', letterSpacing: 'var(--tracking-display)',
            }}>
              Feature gallery
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {availableFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="font-mono"
                  style={{
                    padding: '8px 18px', borderRadius: 999,
                    fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
                    border: `1px solid ${filter === f ? 'var(--accent-gold)' : 'var(--border-dim)'}`,
                    background: filter === f ? 'var(--accent-gold-dim)' : 'transparent',
                    color: filter === f ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              ref={galleryRef}
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 20,
              }}
              className="gallery-grid"
            >
              {visibleGallery.map((img, i) => (
                <motion.div
                  layout
                  key={img.seed}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="gallery-item"
                  style={{
                    gridColumn: i === 0 && visibleGallery.length > 1 ? 'span 2' : 'span 1',
                    position: 'relative', aspectRatio: i === 0 && visibleGallery.length > 1 ? '16/8' : '4/3',
                    borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-dim)',
                  }}
                >
                  <img
                    src={`https://picsum.photos/seed/${img.seed}/1200/900`}
                    alt={img.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '32px 20px 16px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  }}>
                    <span className="font-body" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                      {img.caption}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stack */}
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 clamp(24px,5vw,80px) clamp(80px,10vw,120px)',
          borderTop: '1px solid var(--border-dim)',
          paddingTop: 'clamp(56px,7vw,88px)',
        }}>
          <div className="label-text" style={{ marginBottom: 20 }}>Built with</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {project.stack.map(tech => (
              <span key={tech} className="stack-pill">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Related projects */}
        {related.length > 0 && (
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            padding: '0 clamp(24px,5vw,80px) clamp(80px,10vw,120px)',
          }}>
            <div className="label-text" style={{ marginBottom: 32 }}>More Work</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/projects/${r.slug}/`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div style={{
                    position: 'relative', aspectRatio: '4/3', borderRadius: 4,
                    overflow: 'hidden', border: '1px solid var(--border-dim)', marginBottom: 16,
                  }}>
                    <img
                      src={`https://picsum.photos/seed/${r.seed}/800/600`}
                      alt={r.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <span className="label-text" style={{ display: 'block', marginBottom: 6 }}>
                    {r.category}
                  </span>
                  <div className="font-display" style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontWeight: 600, fontSize: 17, color: 'var(--text-primary)',
                  }}>
                    {r.title}
                    <ArrowUpRight size={16} strokeWidth={1.75} color="var(--accent-gold)" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .overview-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .gallery-grid {
            grid-template-columns: 1fr !important;
          }
          .gallery-grid > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </>
  );
}
