import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Technology {
  year: string;
  title: string;
  description: string;
  icon: string;
}

const timeline: Technology[] = [
  {
    year: '1829',
    title: 'Invention du Braille',
    description: "Louis Braille crée un système d'écriture tactile révolutionnaire",
    icon: '⠃',
  },
  {
    year: '1921',
    title: 'Première canne blanche',
    description: 'Symbole universel de la cécité pour la mobilité',
    icon: '🦯',
  },
  {
    year: '1960',
    title: 'Chiens guides',
    description: "Démocratisation des programmes de chiens d'assistance",
    icon: '🦮',
  },
  {
    year: '2000',
    title: "Lecteurs d'écran",
    description: 'Accès numérique avec JAWS, NVDA et VoiceOver',
    icon: '🔊',
  },
  {
    year: '2020',
    title: 'IA et reconnaissance',
    description: "Applications mobiles qui décrivent l'environnement",
    icon: '🤖',
  },
  {
    year: '2025',
    title: 'Réalité augmentée sonore',
    description: 'Navigation spatiale avec audio 3D',
    icon: '🎧',
  },
];

export default function Section6_Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          y: 50,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-white py-20" aria-labelledby="technology-title">
      <div className="container-custom px-4">
        <h2
          id="technology-title"
          className="display-text text-display-sm md:text-display-md text-center mb-16"
        >
          Technologies d'Assistance
        </h2>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary transform md:-translate-x-1/2"
            aria-hidden="true"
          />

          {/* Timeline items */}
          <div className="space-y-12">
            {timeline.map((tech, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) itemsRef.current[index] = el;
                }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Year badge */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-16 h-16 rounded-full bg-primary flex items-center justify-center z-10 shadow-lg">
                  <span className="stat-number text-white text-sm font-bold">{tech.year}</span>
                </div>

                {/* Content card */}
                <div
                  className={`ml-28 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'}`}
                >
                  <div className="card">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl flex-shrink-0" aria-hidden="true">
                        {tech.icon}
                      </span>
                      <div>
                        <h3 className="display-text text-xl md:text-2xl mb-2">{tech.title}</h3>
                        <p className="body-text text-body-md text-gray-600">{tech.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom message */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <p className="body-text text-body-lg text-gray-700">
            L'innovation technologique continue de transformer la vie des personnes malvoyantes
          </p>
        </div>
      </div>
    </section>
  );
}
