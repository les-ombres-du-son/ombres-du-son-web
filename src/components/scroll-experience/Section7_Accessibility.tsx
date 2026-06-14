import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AccessibilityItem {
  title: string;
  description: string;
  icon: string;
  stat: string;
}

const accessibilityItems: AccessibilityItem[] = [
  {
    title: 'Sites Web Accessibles',
    description:
      "Un site accessible respecte les normes WCAG 2.1 : contrastes suffisants, navigation clavier, lecteurs d'écran compatibles.",
    icon: '🌐',
    stat: '98% des sites ne sont pas accessibles',
  },
  {
    title: 'Documents Adaptés',
    description:
      'PDF structurés avec balises, documents en braille, gros caractères, ou version audio.',
    icon: '📄',
    stat: '1 Français sur 10 a besoin de documents adaptés',
  },
  {
    title: 'Signalétique Tactile',
    description: 'Plans en relief, bandes podotactiles, signaux sonores aux feux piétons.',
    icon: '🚏',
    stat: 'Obligatoire dans les ERP depuis 2015',
  },
  {
    title: 'Applications Mobiles',
    description:
      "Apps avec VoiceOver (iOS) et TalkBack (Android), contrastes réglables, simplification d'interface.",
    icon: '📱',
    stat: '85% des apps sont inutilisables sans voix',
  },
];

const legalItems = [
  { year: '2005', text: "Loi handicap : obligation d'accessibilité" },
  { year: '2012', text: 'RGAA : référentiel technique français' },
  { year: '2019', text: 'Directive européenne : sites publics obligatoires' },
  { year: '2025', text: '100% des services publics accessibles' },
];

export default function Section7_Accessibility() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            end: 'top 45%',
            scrub: 1,
          },
        });
      });

      timelineRef.current.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          y: 30,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 60%',
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
      className="section bg-gradient-to-b from-gray-800 to-gray-900 text-white py-20"
      aria-labelledby="accessibility-title"
    >
      <div className="container-custom px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            id="accessibility-title"
            className="display-text text-display-sm md:text-display-md mb-6"
          >
            L'Accessibilité Aujourd'hui
          </h2>
          <p className="body-text text-body-lg text-gray-300 max-w-2xl mx-auto">
            Un droit fondamental, pas une option. Chaque personne mérite un accès égal à
            l'information.
          </p>
        </div>

        {/* Accessibility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
          {accessibilityItems.map((item, index) => (
            <div
              key={item.title}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="flex-1">
                  <h3 className="display-text text-xl mb-2">{item.title}</h3>
                  <p className="body-text text-body-sm text-gray-300 mb-3">{item.description}</p>
                  <p className="text-xs text-primary font-medium">📊 {item.stat}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Timeline - Simple Grid */}
        <div className="max-w-4xl mx-auto">
          <h3 className="display-text text-2xl text-center mb-10">L'Accessibilité en France</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {legalItems.map((item) => (
              <div
                key={item.year}
                className="bg-gray-700/30 rounded-xl p-5 border border-gray-600/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="font-bold text-white text-sm">{item.year}</span>
                  </div>
                  <p className="body-text text-body-sm text-gray-200">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Callout */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-primary/10 border border-primary/30 rounded-2xl px-8 py-6">
            <p className="body-text text-body-lg text-primary">
              💡 Le handicap visuel touche 1,7 million de Français
            </p>
            <p className="text-sm text-gray-400 mt-2">
              L'accessibilité numérique est un enjeu de société
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
