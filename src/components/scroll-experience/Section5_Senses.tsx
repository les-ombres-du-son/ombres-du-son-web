import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Sense {
  name: string;
  icon: string;
  title: string;
  description: string;
  fact: string;
  color: string;
}

const senses: Sense[] = [
  {
    name: 'hearing',
    icon: '👂',
    title: "L'OUÏE",
    description: 'Les personnes aveugles peuvent localiser un objet à 1° près grâce au son',
    fact: "L'écholocation humaine est possible",
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'touch',
    icon: '✋',
    title: 'LE TOUCHER',
    description: 'Les lecteurs experts de braille lisent à 200 mots/min',
    fact: 'Comparé à 250 mots/min en lecture visuelle',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'smell',
    icon: '👃',
    title: "L'ODORAT",
    description: 'Reconnaître un lieu par son odeur unique',
    fact: 'Chaque environnement a sa signature olfactive',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function Section5_Senses() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          scale: 0.8,
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            end: 'top 40%',
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
      className="section bg-gray-900 text-white py-20"
      aria-labelledby="senses-title"
    >
      <div className="container-custom px-4">
        <div className="text-center mb-16">
          <h2 id="senses-title" className="display-text text-display-sm md:text-display-md mb-6">
            Les Sens Compensatoires
          </h2>
          <p className="body-text text-body-lg text-gray-300 max-w-2xl mx-auto">
            Quand la vue disparaît... les autres sens s'éveillent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {senses.map((sense, index) => (
            <div
              key={sense.name}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-gray-800 rounded-2xl p-8 h-full border border-gray-700 hover:border-gray-600 transition-all duration-300">
                {/* Icon with gradient background */}
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${sense.color} flex items-center justify-center mb-6 mx-auto`}
                >
                  <span className="text-4xl" aria-hidden="true">
                    {sense.icon}
                  </span>
                </div>

                {/* Title */}
                <h3 className="display-text text-2xl text-center mb-4">{sense.title}</h3>

                {/* Description */}
                <p className="body-text text-body-md text-gray-300 text-center mb-4">
                  {sense.description}
                </p>

                {/* Fact */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-sm text-gray-400 text-center italic">{sense.fact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom message */}
        <div className="text-center mt-16">
          <p className="body-text text-body-lg text-gray-300 max-w-3xl mx-auto">
            Le cerveau humain est extraordinairement adaptable. Lorsqu'un sens est absent, les
            autres se développent pour compenser.
          </p>
        </div>
      </div>
    </section>
  );
}
