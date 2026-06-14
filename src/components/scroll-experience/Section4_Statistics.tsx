import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Statistic {
  number: number;
  suffix: string;
  label: string;
  description: string;
  comparison?: string;
}

const statistics: Statistic[] = [
  {
    number: 2200000000,
    suffix: '',
    label: 'personnes vivent avec une déficience visuelle',
    description: "C'est plus que la population de l'Afrique",
    comparison: '🌍',
  },
  {
    number: 43000000,
    suffix: '',
    label: 'personnes sont aveugles',
    description: 'Soit 1 personne toutes les 5 secondes',
    comparison: '⏱️',
  },
  {
    number: 90,
    suffix: '%',
    label: 'des personnes aveugles vivent dans des pays à faible revenu',
    description: "L'accès aux soins reste très inégal",
    comparison: '🌐',
  },
  {
    number: 80,
    suffix: '%',
    label: 'des cas de cécité sont évitables ou traitables',
    description: 'Mais les ressources manquent',
    comparison: '💊',
  },
];

export default function Section4_Statistics() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStat, setCurrentStat] = useState(0);
  const [displayNumber, setDisplayNumber] = useState(statistics[0].number);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const statIndex = Math.min(
            Math.floor(progress * statistics.length),
            statistics.length - 1
          );

          if (statIndex !== currentStat) {
            setCurrentStat(statIndex);

            // Animate number change
            gsap.to(
              { val: displayNumber },
              {
                val: statistics[statIndex].number,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate: function () {
                  setDisplayNumber(Math.floor(this.targets()[0].val));
                },
              }
            );
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [currentStat, displayNumber]);

  const stat = statistics[currentStat];

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace('.0', '') + ' milliards';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + ' millions';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + ' K';
    }
    return num.toString();
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-white flex items-center justify-center py-20"
      aria-labelledby="statistics-title"
    >
      <div className="max-w-5xl mx-auto text-center px-4">
        <h2 id="statistics-title" className="sr-only">
          Le Monde en Chiffres
        </h2>

        {/* Main statistic */}
        <div className="mb-16">
          <div className="text-8xl mb-6" aria-hidden="true">
            {stat.comparison}
          </div>

          <p
            className="stat-number text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary mb-8 font-bold transition-all duration-300"
            aria-live="polite"
          >
            {stat.suffix === '%' ? displayNumber : formatNumber(displayNumber)}
            {stat.suffix}
          </p>

          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl text-gray-900 max-w-3xl mx-auto mb-6 font-bold leading-tight transition-all duration-300">
            {stat.label}
          </h3>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light transition-all duration-300">
            {stat.description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3">
          {statistics.map((_, index) => (
            <div
              key={index}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentStat ? 'bg-primary w-12' : 'bg-gray-300 w-3'
              }`}
              aria-label={`Statistique ${index + 1}`}
              aria-current={index === currentStat ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
