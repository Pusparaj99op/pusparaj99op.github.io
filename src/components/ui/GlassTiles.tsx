'use client';

import { useMemo, type CSSProperties } from 'react';

interface Tile {
  hue: number;
  delay: number;
  duration: number;
  size: number;
}

const COLORS = [42, 340, 200, 265, 20];

export default function GlassTiles({ rows = 5, cols = 8 }: { rows?: number; cols?: number }) {
  const tiles = useMemo<Tile[]>(() => {
    const count = rows * cols;
    return Array.from({ length: count }, (_, i) => ({
      hue: COLORS[i % COLORS.length],
      delay: (i % cols) * 0.35 + Math.floor(i / cols) * 0.2,
      duration: 6 + ((i * 37) % 5),
      size: 0.85 + ((i * 13) % 30) / 100,
    }));
  }, [rows, cols]);

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: 'clamp(6px, 1vw, 14px)',
        padding: 'clamp(6px, 1vw, 14px)',
        pointerEvents: 'none',
        overflow: 'hidden',
        maskImage: 'radial-gradient(120% 90% at 50% 40%, black 40%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(120% 90% at 50% 40%, black 40%, transparent 85%)',
      }}
    >
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="glass-tile"
          style={{
            '--tile-hue': tile.hue,
            '--tile-delay': `${tile.delay}s`,
            '--tile-duration': `${tile.duration}s`,
            transform: `scale(${tile.size})`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
