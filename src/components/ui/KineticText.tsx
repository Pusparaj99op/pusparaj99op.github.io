'use client';

import { useEffect, useRef, ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  accentWords?: string[];
  /** Scroll trigger start position */
  start?: string;
}

/**
 * Splits text into words and gives each word a DIFFERENT entrance animation
 * (cycling through slide, scale-blur-pop, skew-slide, and a 3D flip) so a
 * single heading reads as a small choreographed swarm rather than a uniform
 * stagger. Every animation is driven off ScrollTrigger and runs once.
 */
export default function KineticText({ children, as: Tag = 'div', className, style, accentWords = [], start = 'top 82%' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const words = el.querySelectorAll<HTMLElement>('.kinetic-word');

    const ctx = gsap.context(() => {
      gsap.set(el, { perspective: 600 });

      words.forEach((word, i) => {
        const variant = i % 4;

        if (variant === 0) {
          gsap.fromTo(word,
            { y: 46, opacity: 0, filter: 'blur(0px)' },
            {
              y: 0, opacity: 1, duration: 0.7, ease: 'power4.out',
              scrollTrigger: { trigger: el, start, once: true },
              delay: i * 0.055,
            }
          );
        } else if (variant === 1) {
          gsap.fromTo(word,
            { scale: 0.4, opacity: 0, filter: 'blur(10px)' },
            {
              scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'back.out(2.2)',
              scrollTrigger: { trigger: el, start, once: true },
              delay: i * 0.055,
            }
          );
        } else if (variant === 2) {
          gsap.fromTo(word,
            { x: -34, skewX: -14, opacity: 0 },
            {
              x: 0, skewX: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
              scrollTrigger: { trigger: el, start, once: true },
              delay: i * 0.055,
            }
          );
        } else {
          gsap.fromTo(word,
            { rotateX: 90, y: 20, opacity: 0, transformOrigin: '50% 100%' },
            {
              rotateX: 0, y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: el, start, once: true },
              delay: i * 0.055,
            }
          );
        }
      });
    }, el);

    return () => ctx.revert();
  }, [start]);

  const words = children.split(' ');
  const accentSet = new Set(accentWords.map(w => w.toLowerCase().replace(/[.,!?]/g, '')));

  return (
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={className} style={{ ...style, perspective: 600 }}>
      {words.map((word, i) => {
        const isAccent = accentSet.has(word.toLowerCase().replace(/[.,!?]/g, ''));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block', overflow: 'visible', verticalAlign: 'top',
              paddingBottom: '0.14em', marginRight: i < words.length - 1 ? '0.28em' : 0,
            }}
          >
            <span
              className="kinetic-word"
              style={{
                display: 'inline-block', willChange: 'transform, opacity, filter',
                color: isAccent ? 'var(--accent-gold)' : undefined,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
