'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const TEXT = 'PRANAY GAJBHIYE · PRANAY GAJBHIYE · PRANAY GAJBHIYE · ';

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const marquee = marqueeRef.current;
    if (!marquee) return;

    gsap.to(marquee, {
      x: '-50%',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }, []);

  return (
    <footer
      ref={sectionRef}
      style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
        overflow: 'hidden',
        paddingBottom: 0,
      }}
    >
      {/* Giant scrolling text */}
      <div style={{ overflow: 'hidden', padding: 'clamp(48px,8vw,100px) 0 clamp(32px,5vw,60px)' }}>
        <div
          ref={marqueeRef}
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            width: 'max-content',
          }}
        >
          {[TEXT, TEXT].map((t, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(48px, 8vw, 120px)',
                color: 'rgba(10,228,72,0.06)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '24px clamp(24px,5vw,64px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', marginBottom: 4 }}>
              © 2025 Pranay Krupakar Gajbhiye
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#333', letterSpacing: '0.05em' }}>
              BlackObsidian · Zorvain Street
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12,
              color: '#444', letterSpacing: '0.02em',
            }}>
              Designed & Built with{' '}
              <span style={{ color: '#0ae448' }}>♟</span>
              {' '}precision
            </span>

            {/* PG monogram */}
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 20, color: '#0ae448', letterSpacing: '-0.02em',
            }}>
              PG
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
