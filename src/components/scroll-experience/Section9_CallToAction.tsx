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
                    <h2
                        id="cta-title"
                        className="display-text text-display-sm md:text-display-md mb-6"
                    >
                        Prêt à vivre l'expérience ?
                    </h2>

                    <p className="body-text text-body-lg mb-12 text-white/90">
                        Téléchargez "Les Ombres du Son" et découvrez le monde à travers les yeux de ceux qui ne voient pas
                    </p>

                    {/* App mockup placeholder */}
                    <div className="mb-12 relative">
                        <div className="w-64 h-96 mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border-4 border-white/20 shadow-2xl flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="text-6xl mb-4">📱</div>
                                <p className="text-lg font-medium">App Mobile</p>
                                <p className="text-sm text-white/70 mt-2">Bientôt disponible</p>
                            </div>
                        </div>
                    </div>

                    {/* Download buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold">
                            <span className="flex items-center gap-2">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                App Store
                            </span>
                        </button>

                        <button className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold">
                            <span className="flex items-center gap-2">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>
                                Play Store
                            </span>
                        </button>
                    </div>

                    {/* QR Code placeholder */}
                    <div className="mb-8">
                        <div className="inline-block bg-white p-4 rounded-2xl">
                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-4xl">📷</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-white/80">
                            Scannez pour télécharger
                        </p>
                    </div>

                    {/* Player count */}
                    <div className="glass rounded-2xl p-6 inline-block">
                        <p className="stat-number text-3xl md:text-4xl text-white mb-2">
                            {playerCount.toLocaleString('fr-FR')}
                        </p>
                        <p className="body-text text-white/80">
                            joueurs ont déjà essayé
                        </p>
                    </div>

                    {/* Link to leaderboard */}
                    <div className="mt-12">
                        <a
                            href="/leaderboard"
                            className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors text-lg font-medium"
                        >
                            Voir les classements
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
