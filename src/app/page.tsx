'use client';

import { useState, useEffect } from 'react';

import LoadingScreen from '@/components/ui/LoadingScreen';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Navbar from '@/components/ui/Navbar';

import Hero from '@/components/sections/Hero';
import MarqueeStrip from '@/components/sections/MarqueeStrip';
import About from '@/components/sections/About';
import Companies from '@/components/sections/Companies';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Timeline from '@/components/sections/Timeline';
import Achievements from '@/components/sections/Achievements';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease 0.1s' }}>
        <Hero />
        <MarqueeStrip />
        <About />
        <Companies />
        <Skills />
        <Projects />
        <Timeline />
        <Achievements />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
