import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  condition: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Être aveugle ne signifie pas ne pas voir. C'est voir différemment. L'écoute devient ma fenêtre sur le monde.",
    author: 'Marie L.',
    role: 'Enseignante',
    condition: 'Cécité totale',
    avatar: '👩‍🏫',
  },
  {
    quote:
      "Les gens pensent que je suis isolé. Mais je suis plus connecté que jamais grâce aux technologies d'assistance.",
    author: 'Thomas B.',
    role: 'Développeur',
    condition: 'Malvoyant depuis 20 ans',
    avatar: '👨‍💻',
  },
  {
    quote:
      "Je ne vois pas vos expressions, mais j'entends votre silence. J'entends le sourire dans votre voix.",
    author: 'Sophie K.',
    role: 'Musicienne',
    condition: 'Cécité de naissance',
    avatar: '👩‍🎤',
  },
  {
    quote:
      "Chaque jour est une nouvelle cartographie. Je redécouvre le monde à travers le toucher et l'ouïe.",
    author: 'Lucas M.',
    role: 'Architecte',
    condition: 'Dégénérescence rétinienne',
    avatar: '👨‍🎨',
  },
];

export default function Section8_Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          rotateY: index % 2 === 0 ? -15 : 15,
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
      className="section bg-gray-900 text-white py-20 overflow-hidden"
      aria-labelledby="testimonials-title"
    >
      <div className="container-custom px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            id="testimonials-title"
            className="display-text text-display-sm md:text-display-md mb-6"
          >
            Des Vies, Des Voix
          </h2>
          <p className="body-text text-body-lg text-gray-300 max-w-2xl mx-auto">
            Ils vivent le monde différemment. Leurs témoignages nous éclairent.
          </p>
        </div>

        {/* Testimonials Grid - All cards visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0" aria-hidden="true">
                  {testimonial.avatar}
                </span>
                <div className="flex-1">
                  <p className="body-text text-body-md text-gray-200 italic mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-gray-700 pt-3">
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-xs text-primary mt-1">{testimonial.condition}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom message */}
        <div className="text-center mt-16">
          <p className="body-text text-body-lg text-gray-300 max-w-3xl mx-auto">
            Chaque personne déficiente visuelle a une histoire unique. Leur résilience nous inspire
            à créer un monde plus accessible.
          </p>
        </div>
      </div>
    </section>
  );
}
