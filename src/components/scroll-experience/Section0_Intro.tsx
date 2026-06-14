import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Section0_Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollTextRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo animation
      gsap.from(logoRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: 'back.out(1.7)',
      });

      // Fade in animations
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
      });

      gsap.from(scrollTextRef.current, {
        opacity: 0,
        duration: 1,
        delay: 0.9,
        ease: 'power3.out',
      });

      gsap.from(arrowRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1.1,
        ease: 'power3.out',
      });

      // Continuous bounce animation for arrow
      gsap.to(arrowRef.current, {
        y: 10,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 1.5,
      });

      // Animate floating shapes
      const shapes = shapesRef.current?.querySelectorAll('.floating-shape');
      shapes?.forEach((shape, index) => {
        gsap.to(shape, {
          y: '+=20',
          x: '+=10',
          rotation: '+=15',
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        });
      });

      // Animate sound waves
      const waves = shapesRef.current?.querySelectorAll('.sound-wave');
      waves?.forEach((wave, index) => {
        gsap.to(wave, {
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3,
        });
      });

      // Animate eye blinks
      const eyes = shapesRef.current?.querySelectorAll('.eye-icon');
      eyes?.forEach((eye, index) => {
        gsap.to(eye.querySelector('.eye-pupil'), {
          scaleY: 0.1,
          duration: 0.15,
          repeat: -1,
          repeatDelay: 3 + index * 1.5,
          yoyo: true,
          ease: 'power2.inOut',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center relative overflow-hidden"
      aria-labelledby="intro-title"
    >
      {/* Floating shapes and decorations */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Sound waves - left */}
        <svg
          className="sound-wave absolute left-4 top-1/3 w-48 h-24 text-primary opacity-70"
          viewBox="0 0 200 100"
        >
          <path
            d="M 0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 0 50 Q 25 40, 50 50 T 100 50 T 150 50 T 200 50"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 0 50 Q 25 45, 50 50 T 100 50 T 150 50 T 200 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>

        {/* Sound waves - right */}
        <svg
          className="sound-wave absolute right-4 top-1/3 w-48 h-24 text-primary opacity-70"
          viewBox="0 0 200 100"
        >
          <path
            d="M 0 50 Q 25 70, 50 50 T 100 50 T 150 50 T 200 50"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 0 50 Q 25 60, 50 50 T 100 50 T 150 50 T 200 50"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 0 50 Q 25 55, 50 50 T 100 50 T 150 50 T 200 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>

        {/* Eye icons with blink animation */}
        <div className="eye-icon floating-shape absolute top-32 right-20">
          <svg className="w-16 h-16 text-secondary" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="32" rx="24" ry="16" stroke="currentColor" strokeWidth="3" />
            <g className="eye-pupil">
              <circle cx="32" cy="32" r="8" fill="currentColor" />
              <circle cx="32" cy="32" r="4" fill="white" />
            </g>
          </svg>
        </div>

        <div className="eye-icon floating-shape absolute bottom-32 left-20">
          <svg className="w-16 h-16 text-secondary" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="32" rx="24" ry="16" stroke="currentColor" strokeWidth="3" />
            <g className="eye-pupil">
              <circle cx="32" cy="32" r="8" fill="currentColor" />
              <circle cx="32" cy="32" r="4" fill="white" />
            </g>
          </svg>
        </div>

        {/* Geometric shapes - enhanced with more variety */}
        <div className="floating-shape absolute top-24 left-16 w-4 h-4 bg-primary rounded-full shadow-lg" />
        <div className="floating-shape absolute top-40 left-32 w-3 h-3 bg-primary shadow-md" />
        <div className="floating-shape absolute top-1/4 left-1/4 w-6 h-6 border-2 border-secondary rounded-full" />
        <div className="floating-shape absolute top-1/3 left-12 w-4 h-4 border-2 border-secondary rotate-45" />

        <div className="floating-shape absolute top-20 right-32 w-4 h-4 bg-primary rounded-full shadow-lg" />
        <div className="floating-shape absolute top-1/4 right-16 w-5 h-5 border-2 border-primary rotate-12" />
        <div className="floating-shape absolute top-1/3 right-1/4 w-3 h-3 bg-secondary shadow-md" />
        <div className="floating-shape absolute bottom-1/3 right-20 w-4 h-4 bg-primary rounded-full shadow-lg" />

        <div className="floating-shape absolute bottom-40 left-1/3 w-4 h-4 bg-primary rounded-full shadow-lg" />
        <div className="floating-shape absolute bottom-1/4 right-1/3 w-6 h-6 border-2 border-secondary rounded-full" />
        <div className="floating-shape absolute bottom-32 right-40">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-secondary" />
        </div>

        {/* Additional accent shapes */}
        <div className="floating-shape absolute top-1/2 left-8 w-2 h-2 bg-accent rounded-full shadow-sm" />
        <div className="floating-shape absolute top-2/3 right-12 w-2 h-2 bg-accent rounded-full shadow-sm" />
        <div className="floating-shape absolute bottom-1/2 left-1/2 w-3 h-3 border border-accent rounded-full" />
      </div>

      {/* Main content */}
      <div className="text-center max-w-6xl mx-auto px-4 relative z-10">
        {/* Logo */}
        <img
          ref={logoRef}
          src="/logo.png"
          alt="Les Ombres du Son - Logo"
          className="w-64 h-64 mx-auto mb-8 drop-shadow-2xl"
        />

        {/* Title */}
        <h1
          ref={titleRef}
          id="intro-title"
          className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight mb-8 text-gray-900"
          style={{ letterSpacing: '-0.02em' }}
        >
          LES OMBRES
          <br />
          DU SON
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-32 font-light"
        >
          Un voyage dans l'invisible
        </p>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-4">
          <p ref={scrollTextRef} className="text-sm text-gray-500 font-light tracking-wide">
            Scroll pour commencer
          </p>

          <div ref={arrowRef}>
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
