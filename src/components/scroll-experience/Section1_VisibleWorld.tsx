import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Section1_VisibleWorld() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      // Create ScrollTrigger for blur effect WITHOUT pin
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          if (imageRef.current) {
            const blur = progress * 25;
            const brightness = 1 - progress * 0.75;
            const saturate = 1 - progress * 0.5;
            imageRef.current.style.filter = `blur(${blur}px) brightness(${brightness}) saturate(${saturate})`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getMessage = () => {
    if (scrollProgress < 0.33) {
      return "C'est ce que vous voyez chaque jour";
    } else if (scrollProgress < 0.66) {
      return 'Imaginez perdre cette clarté';
    } else {
      return "Pour certains, c'est déjà une réalité";
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative flex items-center justify-center"
      aria-labelledby="visible-world-title"
    >
      {/* Background image */}
      <div
        ref={imageRef}
        className="absolute inset-0 bg-cover bg-center transition-all duration-100"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80)',
        }}
        role="img"
        aria-label="Vue d'une rue urbaine"
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h2
          id="visible-world-title"
          className="font-display text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
        >
          Le Monde Visible
        </h2>

        <p className="text-xl md:text-3xl text-white max-w-2xl mx-auto drop-shadow-2xl mb-12 font-light">
          {getMessage()}
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 inline-block border border-white/20">
          <p className="stat-number text-5xl md:text-7xl text-accent mb-2">2.2 milliards</p>
          <p className="text-lg md:text-xl text-white">de personnes ne voient pas le monde ainsi</p>
        </div>
      </div>
    </section>
  );
}
