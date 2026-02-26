# 🚀 Déploiement Rapide - Cloud Run

Guide minimaliste pour déployer rapidement l'application web.

## Prérequis

```bash
# Installer gcloud CLI si nécessaire
# https://cloud.google.com/sdk/docs/install

# Se connecter à GCP
gcloud auth login

# Définir le projet
gcloud config set project YOUR_PROJECT_ID
```

## Déploiement en 3 commandes

### 1. Activer les APIs

```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### 2. Build et Push

```bash
cd ombres-du-son-web
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/ombres-du-son-web
```

### 3. Déployer

```bash
gcloud run deploy ombres-du-son-web \
  --image gcr.io/$(gcloud config get-value project)/ombres-du-son-web \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

## C'est tout ! 🎉

L'URL de votre application sera affichée dans le terminal.

## Mise à jour

Pour mettre à jour l'application, répétez simplement les étapes 2 et 3.

## Voir les logs

```bash
gcloud run services logs tail ombres-du-son-web --region europe-west1
```

## Supprimer le service

```bash
gcloud run services delete ombres-du-son-web --region europe-west1
```
