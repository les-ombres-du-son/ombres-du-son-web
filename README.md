# Les Ombres du Son — Site Web

Site web interactif de sensibilisation au handicap visuel, développé avec Astro et déployé sur Google Cloud Platform (Cloud Run).

## 🌐 Site en production

**👉 [https://ombres-du-son-web-production-346375999456.europe-west1.run.app](https://ombres-du-son-web-production-346375999456.europe-west1.run.app)**

| Environnement | URL |
|---------------|-----|
| **Production** | https://ombres-du-son-web-production-346375999456.europe-west1.run.app |
| **Staging** | https://ombres-du-son-web-staging-7vvww4z7ra-ew.a.run.app |
| **Local** | http://localhost:4321 |

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

Le déploiement est automatisé via **GitHub Actions** vers **Google Cloud Run** :

| Branche | Environnement | Workflow |
|---------|---------------|----------|
| `develop` | (dev) | build & checks |
| `staging` | Staging | déploiement automatique sur Cloud Run staging |
| `main` | Production | déploiement automatique sur Cloud Run production |

L'infrastructure (GCP, Firebase, organisation GitHub) est gérée par Terraform dans le dépôt
[`infrastructure`](https://github.com/les-ombres-du-son/infrastructure). Les workflows partagés
et la documentation des secrets CI/CD sont dans le dépôt
[`.github`](https://github.com/les-ombres-du-son/.github).

### Authentification Firebase

L'authentification Google nécessite que le domaine soit listé dans
**Firebase Console → Authentication → Settings → Authorized domains**.
Les domaines Cloud Run (production, staging) et `*.firebaseapp.com` y sont déclarés.

## 📄 Licence

MIT
