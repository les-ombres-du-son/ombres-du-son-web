# Quiz Pré-Installation - Configuration

Ce document explique comment configurer et déployer le quiz pré-installation pour "Les Ombres du Son".

## Vue d'ensemble

Le quiz pré-installation permet de :
1. Mesurer les connaissances initiales des utilisateurs sur le handicap visuel
2. Comparer ces connaissances avec celles acquises après avoir joué (quiz final in-app)
3. Quantifier l'impact pédagogique du jeu

## Architecture

### Séparation des bases de données

**Firestore** (pour les quiz - données structurées et permanentes)
- `quiz_pre_installation` : Résultats du quiz avant le jeu
- `quiz_final` : Résultats du quiz après le jeu
- Avantages : Requêtes complexes, indexation, scalabilité

**Realtime Database** (pour les sessions de jeu - données temps réel)
- `active_sessions` : Sessions de jeu en cours
- `reponse_ai` : Conseils générés par l'IA
- Avantages : Synchronisation temps réel, faible latence

### Flux utilisateur

```
Utilisateur → Quiz (6 questions) → Connexion Google → Sauvegarde Firestore → Téléchargement APK
                                                              ↓
                                              Firestore: quiz_pre_installation/{userId}
```

## Configuration Firebase

### 1. Activer l'authentification Google

Dans la console Firebase :
1. Allez dans **Authentication** > **Sign-in method**
2. Activez **Google** comme fournisseur
3. Configurez le domaine autorisé : `ombres-du-son-web-staging-346375999456.europe-west1.run.app`

### 2. Activer Firestore

Dans la console Firebase :
1. Allez dans **Firestore Database**
2. Cliquez sur **Create database**
3. Choisissez **Production mode**
4. Sélectionnez la région : **europe-west1**

### 3. Configurer les variables d'environnement (Optionnel)

Les valeurs Firebase sont déjà hardcodées dans `firebase.ts`. Vous pouvez créer un fichier `.env` pour les surcharger :

```bash
# APK Download URL (À configurer)
PUBLIC_APK_DOWNLOAD_URL=https://storage.googleapis.com/les-ombres-du-son-apk/app-release.apk
```

Les autres valeurs Firebase sont déjà configurées par défaut.

### 4. Règles de sécurité Firestore

Ajoutez ces règles dans **Firestore Database** > **Rules** :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Quiz pré-installation
    match /quiz_pre_installation/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quiz final (après le jeu)
    match /quiz_final/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Règles de sécurité Realtime Database (pour les sessions de jeu)

Ces règles sont pour l'app mobile uniquement :

```json
{
  "rules": {
    "active_sessions": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Structure des données

### Firestore - Quiz Pré-Installation

Collection : `quiz_pre_installation`

Document ID : `{userId}`

```json
{
  "userId": "userId123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "answers": [1, 1, 2, 0, 0, 1],
  "score": 4,
  "total": 6,
  "timestamp": 1774873200000,
  "completedAt": "2026-04-09T12:00:00Z"
}
```

### Firestore - Quiz Final (à implémenter dans l'app mobile)

Collection : `quiz_final`

Document ID : `{userId}`

```json
{
  "userId": "userId123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "answers": [1, 1, 2, 0, 0, 1],
  "score": 6,
  "total": 6,
  "timestamp": 1774873500000,
  "completedAt": "2026-04-09T13:00:00Z"
}
```

### Realtime Database - Sessions de jeu (app mobile uniquement)

```json
{
  "active_sessions": {
    "userId123": {
      "Intro": { "status": "completed", "score": 100 },
      "Niveau1": { "status": "playing", "currentStep": "sonar" },
      "metrics": { "timeSpent": 120, "distanceToTarget": 250 },
      "reponse_ai": {
        "message": "Conseil généré par Vertex AI",
        "type": "stuck_far_from_target",
        "timestamp": 1774873200000
      }
    }
  }
}
```

### Mapping des questions

| # | Thème | Question Pré-Install | Question Finale (in-app) |
|---|-------|---------------------|--------------------------|
| 1 | Communication | Pourquoi interrompre est problématique ? | Pourquoi un bruit inattendu est désagréable ? |
| 2 | Bruit urbain | Impact du bruit urbain ? | Pourquoi un carrefour en travaux est critique ? |
| 3 | Guidage | Comment aider pour traverser ? | Quelle action est la plus dangereuse ? |
| 4 | Aménagements | Quel aménagement rend accessible ? | Quel aménagement résout le problème de salles ? |
| 5 | Accessibilité web | Pourquoi sites inaccessibles ? | Pourquoi sites inaccessibles (détaillé) ? |
| 6 | Inclusion | Qu'est-ce que l'inclusion ? | Définition de l'inclusion (détaillée) ? |

## Déploiement

### Développement local

```bash
cd ombres-du-son-web
npm install
npm run dev
```

Accédez à : `http://localhost:4321/quiz-pre-installation`

### Production (Cloud Run)

```bash
npm run build
gcloud run deploy ombres-du-son-web-staging \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated
```

## Hébergement de l'APK

### Option 1 : Cloud Storage (Recommandé)

```bash
# Créer un bucket public
gsutil mb -l europe-west1 gs://les-ombres-du-son-apk

# Rendre le bucket public
gsutil iam ch allUsers:objectViewer gs://les-ombres-du-son-apk

# Uploader l'APK
gsutil cp app-release.apk gs://les-ombres-du-son-apk/

# URL publique
https://storage.googleapis.com/les-ombres-du-son-apk/app-release.apk
```

### Option 2 : Firebase Storage

```bash
# Uploader via la console Firebase
# Storage > Upload file > app-release.apk
# Rendre public et copier l'URL
```

## Analyse des résultats

### Récupérer les données depuis Firestore

```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Récupérer tous les quiz pré-installation
const preQuizRef = collection(db, 'quiz_pre_installation');
const preQuizSnapshot = await getDocs(preQuizRef);
const allPreResults = preQuizSnapshot.docs.map(doc => doc.data());

// Calculer les statistiques
const scores = allPreResults.map(r => r.score);
const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
```

### Comparer avant/après

```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

async function compareUserProgress(userId) {
  // Récupérer quiz pré-installation
  const preQuizDoc = await getDoc(doc(db, 'quiz_pre_installation', userId));
  const preQuizData = preQuizDoc.data();
  
  // Récupérer quiz final
  const finalQuizDoc = await getDoc(doc(db, 'quiz_final', userId));
  const finalQuizData = finalQuizDoc.data();
  
  // Calculer la progression
  const progression = ((finalQuizData.score - preQuizData.score) / 6) * 100;
  
  return {
    before: preQuizData.score,
    after: finalQuizData.score,
    progression: progression
  };
}
```

## Pages créées

- `/quiz-pre-installation` - Quiz principal
- `/politique-confidentialite` - RGPD
- `/mentions-legales` - Informations légales

## Composants

- `QuizAuth.tsx` - Authentification Google et sauvegarde Firestore
- `firebase.ts` - Configuration Firebase (Firestore + Auth)
- `quiz-pre-installation.astro` - Page du quiz avec 6 questions
- `politique-confidentialite.astro` - Politique RGPD
- `mentions-legales.astro` - Mentions légales

## Prochaines étapes

1. ✅ Quiz pré-installation créé avec 6 questions
2. ✅ Authentification Google intégrée
3. ✅ Sauvegarde Firestore implémentée
4. ✅ Politique de confidentialité ajoutée
5. ✅ Séparation Firestore (quiz) / Realtime Database (sessions)
6. ⏳ Activer Firestore dans la console Firebase
7. ⏳ Configurer les règles de sécurité Firestore
8. ⏳ Uploader l'APK sur Cloud Storage
9. ⏳ Implémenter le quiz final dans l'app mobile Android
10. ⏳ Créer le dashboard de comparaison avant/après

## Support

Pour toute question : contact@lesombresduson.fr
