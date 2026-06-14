import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { onAuthStateChanged, signInWithPopup, type User } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';

export default function Section0_Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollTextRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.href = '/dashboard';
    } catch (err) {
      // silently handle sign-in errors
    } finally {
      setLoading(false);
    }
  };

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
      {/* Sign-in Button - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        {!user ? (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="bg-white/90 hover:bg-white text-gray-800 font-semibold py-3 px-6 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm backdrop-blur-sm border border-gray-200"
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.84h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.84c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Se connecter
          </button>
        ) : (
          <a
            href="/dashboard"
            className="bg-primary/90 hover:bg-primary text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Mon espace
          </a>
        )}
      </div>

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
