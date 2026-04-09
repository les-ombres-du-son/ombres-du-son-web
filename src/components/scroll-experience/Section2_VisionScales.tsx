import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface VisionLevel {
    percentage: number;
    label: string;
    description: string;
    affected: string;
}

const visionLevels: VisionLevel[] = [
    {
        percentage: 100,
        label: 'Vision normale',
        description: 'Vision claire et nette',
        affected: '',
    },
    {
        percentage: 80,
        label: 'Vision avec correction',
        description: 'Nécessite des lunettes ou lentilles',
        affected: '2.5 milliards de personnes',
    },
    {
        percentage: 60,
        label: 'Cataracte légère',
        description: 'Vision légèrement voilée',
        affected: '94 millions de personnes',
    },
    {
        percentage: 40,
        label: 'Cataracte avancée',
        description: 'Vision très floue et halos lumineux',
        affected: '65 millions de personnes',
    },
    {
        percentage: 20,
        label: 'Vision en tunnel',
        description: 'Seul le centre est visible',
        affected: '7 millions de personnes',
    },
    {
        percentage: 5,
        label: 'Perception lumineuse',
        description: 'Distinction lumière/obscurité uniquement',
        affected: '4 millions de personnes',
    },
    {
        percentage: 0,
        label: 'Cécité totale',
        description: 'Absence totale de vision',
        affected: '43 millions de personnes',
    },
];

export default function Section2_VisionScales() {
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [currentLevel, setCurrentLevel] = useState(0);

    useEffect(() => {
        if (!sectionRef.current || !imageRef.current) return;

        const ctx = gsap.context(() => {
            // ScrollTrigger without pin for smoother experience
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const levelIndex = Math.min(
                        Math.floor(progress * visionLevels.length),
                        visionLevels.length - 1
                    );
                    setCurrentLevel(levelIndex);

                    if (imageRef.current) {
                        const level = visionLevels[levelIndex];
                        const blur = ((100 - level.percentage) / 100) * 35;
                        const brightness = 1 - ((100 - level.percentage) / 100) * 0.7;
                        const saturate = 1 - ((100 - level.percentage) / 100) * 0.6;
                        imageRef.current.style.filter = `blur(${blur}px) brightness(${brightness}) saturate(${saturate})`;
                    }
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const level = visionLevels[currentLevel];

    return (
        <section
            ref={sectionRef}
            className="min-h-screen relative bg-gray-900 flex items-center justify-center py-20"
            aria-labelledby="vision-scales-title"
        >
            {/* Background image */}
            <div
                ref={imageRef}
                className="absolute inset-0 bg-cover bg-center transition-all duration-100"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80)',
                }}
                role="img"
                aria-label="Place de ville"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h2 id="vision-scales-title" className="sr-only">
                    Les Échelles de Vision
                </h2>

                {/* Percentage display */}
                <div className="mb-12">
                    <p
                        className="font-mono font-bold text-8xl md:text-9xl text-white drop-shadow-2xl mb-4 transition-all duration-300"
                        aria-live="polite"
                    >
                        {level.percentage}%
                    </p>
                    <p className="text-2xl md:text-3xl text-white/90 drop-shadow-lg font-light">
                        de vision
                    </p>
                </div>

                {/* Level info card */}
                <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/20 shadow-2xl transition-all duration-300">
                    <h3 className="font-display text-3xl md:text-5xl text-white mb-4 font-bold">
                        {level.label}
                    </h3>
                    <p className="text-lg md:text-xl text-white/80 mb-6">
                        {level.description}
                    </p>
                    {level.affected && (
                        <div className="pt-6 border-t border-white/20">
                            <p className="stat-number text-2xl md:text-3xl text-accent">
                                {level.affected}
                            </p>
                        </div>
                    )}
                </div>

                {/* Progress indicator */}
                <div className="mt-10 flex justify-center gap-2">
                    {visionLevels.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentLevel ? 'bg-primary w-12' : 'bg-white/30 w-8'
                                }`}
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
