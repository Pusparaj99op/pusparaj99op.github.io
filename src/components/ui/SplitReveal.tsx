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
  /** Scrub the reveal to scroll position instead of a one-shot enter animation */
  scrub?: boolean;
  /** Words (case-insensitive, punctuation-stripped) to render in the accent color */
  accentWords?: string[];
}

/**
 * Splits text into words and reveals them with a GSAP ScrollTrigger-driven
 * mask animation — the word-by-word scroll choreography seen on
 * studio-driven agency sites (studio-size.com et al).
 */
export default function SplitReveal({ children, as: Tag = 'div', className, style, scrub = false, accentWords = [] }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const words = el.querySelectorAll<HTMLElement>('.split-word');
    const ctx = gsap.context(() => {
      if (scrub) {
        gsap.fromTo(words,
          { yPercent: 100, opacity: 0.15 },
          {
            yPercent: 0, opacity: 1,
            stagger: 0.04, ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 40%',
              scrub: 0.6,
            },
          }
        );
      } else {
        gsap.fromTo(words,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 0.8, stagger: 0.045,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 70%' },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [scrub]);

  const words = children.split(' ');
  const accentSet = new Set(accentWords.map(w => w.toLowerCase().replace(/[.,!?]/g, '')));

  return (
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const isAccent = accentSet.has(word.toLowerCase().replace(/[.,!?]/g, ''));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block', overflow: 'hidden', verticalAlign: 'top',
              paddingBottom: '0.12em', marginRight: i < words.length - 1 ? '0.28em' : 0,
            }}
          >
            <span
              className="split-word"
              style={{ display: 'inline-block', willChange: 'transform, opacity', color: isAccent ? 'var(--accent)' : undefined }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
