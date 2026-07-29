'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { projects } from '@/data/projects';

const NAV_ITEMS = ['About', 'Work', 'Ventures', 'Contact', 'GitHub', 'LinkedIn'];
const doubledProjects = [...projects, ...projects];

function ImageStrip({ reverse }: { reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.fromTo(track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: 35, ease: 'none', repeat: -1 }
      );
    }, track);

    return () => ctx.revert();
  }, [reverse]);

  return (
    <div style={{ overflow: 'hidden' }} onMouseEnter={() => tweenRef.current?.pause()} onMouseLeave={() => tweenRef.current?.play()}>
      <div ref={trackRef} style={{ display: 'flex', gap: 16, width: 'max-content' }}>
        {doubledProjects.map((p, i) => (
          <div
            key={i}
            className="footer-strip-card"
            style={{
              width: 240, height: 160, borderRadius: 4, overflow: 'hidden',
              flexShrink: 0, position: 'relative', border: '1px solid var(--border-dim)',
              transition: 'transform 300ms ease',
            }}
          >
            <img
              src={`https://picsum.photos/seed/${p.seed}/480/320`}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(0.3) brightness(0.8)' }}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        .footer-strip-card:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
}

export default function Footer() {
  const scrollTo = (label: string) => {
    const map: Record<string, string> = {
      About: '#about', Work: '#projects', Ventures: '#ventures', Contact: '#contact',
    };
    const href = map[label];
    if (href) document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links: Record<string, string> = {
    GitHub: 'https://github.com/Pusparaj99op',
    LinkedIn: 'https://www.linkedin.com/in/pranaygajbhiye/',
  };

  return (
    <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-dim)', overflow: 'hidden' }}>
      <div style={{ padding: '48px 0 16px' }}>
        <ImageStrip />
      </div>
      <div style={{ padding: '16px 0 48px' }}>
        <ImageStrip reverse />
      </div>

      <div style={{ borderTop: '1px solid var(--border-dim)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '32px clamp(24px,5vw,80px) 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div className="font-display" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 22, color: 'var(--accent-gold)' }}>
            PG
          </div>
          <nav className="font-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            {NAV_ITEMS.map((item, i) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {links[item] ? (
                  <a href={links[item]} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{item}</a>
                ) : (
                  <button onClick={() => scrollTo(item)} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', padding: 0 }}>{item}</button>
                )}
                {i < NAV_ITEMS.length - 1 && <span style={{ color: 'var(--text-tertiary)' }}>&middot;</span>}
              </span>
            ))}
          </nav>
        </div>

        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '16px clamp(24px,5vw,80px) 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>
              &copy; 2025 Pranay Krupakar Gajbhiye
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              BlackObsidian &middot; Zorvain Street
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
              Designed &amp; Built with &#9822; precision
            </div>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-body"
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: 13, transition: 'color 200ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Back to top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
