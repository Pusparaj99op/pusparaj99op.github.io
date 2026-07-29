'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COLS = 40;
const ROWS = 30;

function ParticleGrid() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { positions, base } = useMemo(() => {
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const spacingX = 26;
    const spacingY = 22;
    let i = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = (x - COLS / 2) * spacingX;
        const py = (y - ROWS / 2) * spacingY;
        positions[i * 3] = px;
        positions[i * 3 + 1] = py;
        positions[i * 3 + 2] = 0;
        base[i * 3] = px;
        base[i * 3 + 1] = py;
        base[i * 3 + 2] = 0;
        i++;
      }
    }
    return { positions, base };
  }, []);

  useFrame(({ clock }) => {
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();
    for (let i = 0; i < COLS * ROWS; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const wave = Math.sin(t * 0.5 + bx * 0.01 + by * 0.01) * 6;
      const dx = (mouse.current.x * 400 - bx) * 0.02;
      const dy = (mouse.current.y * 300 - by) * 0.02;
      pos.setXYZ(i, bx + dx, by + wave + dy, 0);
    }
    pos.needsUpdate = true;
  });

  const onPointerMove = (e: { clientX: number; clientY: number }) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  useMemo(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('mousemove', onPointerMove);
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={1.6} color="#c9a96e" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

export default function HeroBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6 }}>
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 100] }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ParticleGrid />
      </Canvas>
    </div>
  );
}
