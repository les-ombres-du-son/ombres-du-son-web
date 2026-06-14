import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Section9_CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const [playerCount] = useState(10247); // This would come from an API

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section bg-gradient-to-br from-primary via-accent to-secondary py-20"
      aria-labelledby="cta-title"
    >
      <div className="container-custom px-4">
        <div className="cta-content max-w-4xl mx-auto text-center text-white">
          <h2 id="cta-title" className="display-text text-display-sm md:text-display-md mb-6">
            Prêt à vivre l'expérience ?
          </h2>

          <p className="body-text text-body-lg mb-12 text-white/90">
            Téléchargez "Les Ombres du Son" et découvrez le monde à travers les yeux de ceux qui ne
            voient pas
          </p>

          {/* App mockup */}
          <div className="mb-12 relative">
            <div className="w-64 h-96 mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border-4 border-white/20 shadow-2xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-lg font-medium">Les Ombres du Son</p>
                <p className="text-sm text-white/70 mt-2">Application Android</p>
              </div>
            </div>
          </div>

          {/* Download Android Button */}
          <div className="flex justify-center mb-8">
            <a
              href="/dashboard"
              className="btn bg-white text-primary hover:bg-white/90 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-3"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Télécharger l'Application Android
            </a>
          </div>
          <p className="text-sm text-white/70 mb-8">
            Connexion Google requise • Quiz de sensibilisation inclus
          </p>
        </div>
      </div>
    </section>
  );
}
