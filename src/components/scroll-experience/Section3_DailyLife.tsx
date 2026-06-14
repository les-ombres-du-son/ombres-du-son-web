import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimeSlot {
  time: string;
  title: string;
  description: string;
  icon: string;
}

const dailySchedule: TimeSlot[] = [
  {
    time: '6h',
    title: 'Réveil',
    description: "Comment se réveiller sans voir l'heure ?",
    icon: '⏰',
  },
  {
    time: '8h',
    title: 'Petit-déjeuner',
    description: 'Trouver le lait dans le frigo',
    icon: '🥛',
  },
  {
    time: '12h',
    title: 'Déjeuner au restaurant',
    description: 'Lire un menu sans le voir',
    icon: '📋',
  },
  {
    time: '18h',
    title: 'Rentrer chez soi',
    description: 'Traverser la rue en toute sécurité',
    icon: '🚶',
  },
  {
    time: '22h',
    title: 'Coucher',
    description: 'Dans le noir, nous sommes tous égaux',
    icon: '🌙',
  },
];

export default function Section3_DailyLife() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section bg-gradient-to-b from-white to-bg-light py-20"
      aria-labelledby="daily-life-title"
    >
      <div className="container-custom px-4">
        <h2
          id="daily-life-title"
          className="display-text text-display-sm md:text-display-md text-center mb-16"
        >
          Une Journée dans le Noir
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {dailySchedule.map((slot, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="card flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              {/* Time and icon */}
              <div className="flex items-center gap-4 md:w-32 flex-shrink-0">
                <span className="text-4xl" aria-hidden="true">
                  {slot.icon}
                </span>
                <span className="stat-number text-2xl md:text-3xl text-primary">{slot.time}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="display-text text-xl md:text-2xl mb-2">{slot.title}</h3>
                <p className="body-text text-body-md text-gray-600">{slot.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Final message */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <p className="body-text text-body-lg text-gray-700 italic">
            Chaque geste du quotidien devient un défi à relever avec créativité et adaptation
          </p>
        </div>
      </div>
    </section>
  );
}
