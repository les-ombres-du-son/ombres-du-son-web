# Les Ombres du Son

Site web interactif de sensibilisation au handicap visuel, développé avec Astro et déployé sur Google Cloud Platform.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ et npm
- Compte GCP (pour le déploiement)

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

Le site sera accessible sur `http://localhost:4321`

## 📁 Structure du projet

```
/
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants React
│   │   └── scroll-experience/  # Sections de l'expérience
│   ├── layouts/         # Layouts Astro
│   ├── pages/           # Pages du site
│   └── styles/          # Styles globaux
├── infrastructure/      # Configuration Terraform (à venir)
└── package.json
```

## 🎨 Sections de l'expérience

1. **Introduction** - Page d'accueil avec invitation à scroller
2. **Le Monde Visible** - Transition progressive vers le flou
3. **Les Échelles de Vision** - Différents niveaux de déficience visuelle
4. **Statistiques** - Chiffres clés sur le handicap visuel
5. *(À venir)* Une Journée dans le Noir
6. *(À venir)* Les Sens Compensatoires
7. *(À venir)* Technologies d'Assistance
8. *(À venir)* L'Accessibilité Aujourd'hui
9. *(À venir)* Témoignages
10. *(À venir)* Call-to-Action

## 🛠️ Technologies

- **Astro** - Framework web moderne
- **React** - Composants interactifs
- **Tailwind CSS** - Styling utilitaire
- **GSAP** - Animations scroll-based
- **TypeScript** - Type safety

## ♿ Accessibilité

Le site respecte les normes WCAG 2.1 AAA :
- Navigation au clavier
- Support des lecteurs d'écran
- Contraste élevé
- Respect de `prefers-reduced-motion`

## 📱 Responsive

Design 100% responsive :
- Mobile first
- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- Typographie fluide avec `clamp()`

## 🚢 Déploiement

Le déploiement sur GCP sera automatisé via Terraform (configuration à venir).

## 📄 Licence

MIT
