# Flux Utilisateur - Les Ombres du Son

## 📱 Parcours complet de téléchargement

### 1. Page d'accueil (`/`)
- L'utilisateur découvre l'expérience scroll immersive (8 sections)
- **Section 9 (Call-to-Action)** : Bouton "Télécharger l'Application Android"
- Clic sur le bouton → Redirection vers `/dashboard`

### 2. Dashboard (`/dashboard`)

#### 2.1 Utilisateur NON connecté
- Affichage de la page de connexion
- Bouton "Se connecter avec Google"
- Lien vers la politique de confidentialité

#### 2.2 Utilisateur connecté SANS quiz
- **Panneau gauche** : Message "Quiz de sensibilisation requis"
  - Icône 📝
  - Explication : 6 questions sur le handicap visuel
  - Bouton "🎯 Commencer le Quiz" → Redirection vers `/quiz-pre-installation`
  - Durée estimée : 3-5 minutes

- **Panneau droit** : Classement des joueurs
  - Top 10 des meilleurs scores (quiz final)
  - Mise à jour en temps réel
  - Indication si l'utilisateur est dans le classement

#### 2.3 Utilisateur connecté AVEC quiz complété
- **Panneau gauche** : Téléchargement débloqué
  - Badge "✓ Quiz complété" avec score (X/6)
  - Icône Android
  - Bouton "📥 Télécharger l'APK"
  - Instructions d'installation

- **Panneau droit** : Classement des joueurs (identique)

### 3. Quiz pré-installation (`/quiz-pre-installation`)

#### 3.1 Questions
1. Communication avec les personnes non-voyantes
2. Impact du bruit urbain
3. Guidage pour traverser
4. Aménagements accessibles
5. Accessibilité web
6. Inclusion

#### 3.2 Après le quiz
- Affichage du score
- Connexion Google (si pas déjà connecté)
- Sauvegarde dans Firestore : `quiz_pre_installation/{userId}`
- Bouton "Accéder au téléchargement" → Redirection vers `/dashboard`

### 4. Téléchargement APK
- Fichier hébergé sur Cloud Storage
- URL : `https://storage.googleapis.com/les-ombres-du-son-apk/app-release.apk`
- Compatible Android 8.0+

---

## 🔄 Schéma du flux

```
┌─────────────────┐
│  Page d'accueil │
│       (/)       │
└────────┬────────┘
         │ Clic "Télécharger"
         ▼
┌─────────────────┐
│   Dashboard     │
│   (/dashboard)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌──────────────┐
│ Login │  │ Quiz requis? │
└───┬───┘  └──────┬───────┘
    │             │
    │ Google      │ Oui
    │ Auth        ▼
    │      ┌──────────────┐
    │      │     Quiz     │
    │      │ (/quiz-pre-  │
    │      │ installation)│
    │      └──────┬───────┘
    │             │
    │             │ Complété
    │             ▼
    └──────►┌──────────────┐
            │  Dashboard   │
            │ (débloqué)   │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │ Télécharger  │
            │     APK      │
            └──────────────┘
```

---

## 📊 Collections Firestore

### `quiz_pre_installation/{userId}`
```json
{
  "userId": "string",
  "email": "string",
  "displayName": "string",
  "answers": [1, 1, 2, 0, 0, 1],
  "score": 4,
  "total": 6,
  "timestamp": 1776248930655,
  "completedAt": "2026-04-15T12:00:00Z"
}
```

### `quiz_final/{userId}` (app mobile)
```json
{
  "userId": "string",
  "email": "string",
  "displayName": "string",
  "answers": [1, 1, 2, 0, 0, 1],
  "score": 6,
  "total": 6,
  "timestamp": 1776249930655,
  "completedAt": "2026-04-15T13:00:00Z"
}
```

---

## 🎯 Objectifs pédagogiques

1. **Sensibilisation** : Quiz pré-installation pour mesurer les connaissances initiales
2. **Expérience** : Jeu immersif sur mobile (Android)
3. **Évaluation** : Quiz final in-app pour mesurer l'impact
4. **Comparaison** : Dashboard pour voir la progression avant/après

---

## 🔐 Sécurité

- **Authentification** : Google OAuth via Firebase Auth
- **Firestore Rules** : Chaque utilisateur accède uniquement à ses propres données
- **RGPD** : Politique de confidentialité accessible
- **Données** : Stockage sécurisé sur Firebase (projet `les-ombres-du-son-483614`)

---

## 🚀 Déploiement

### Site web
- **Service** : `ombres-du-son-web-staging`
- **Région** : `europe-west1`
- **URL** : Fournie après déploiement Cloud Run

### APK
- **Storage** : Cloud Storage bucket `les-ombres-du-son-apk`
- **Fichier** : `app-release.apk`
- **Accès** : Public (lecture seule)

---

## ✅ Checklist avant déploiement

- [ ] Firestore activé dans Firebase Console
- [ ] Règles de sécurité Firestore configurées
- [ ] Google Auth activé dans Firebase Console
- [ ] APK uploadé sur Cloud Storage
- [ ] Variable d'environnement `PUBLIC_APK_DOWNLOAD_URL` configurée
- [ ] Site web déployé sur Cloud Run
- [ ] Tests du flux complet effectués
