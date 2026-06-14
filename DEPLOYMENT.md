# Guide de Déploiement - Les Ombres du Son Web

Ce guide explique comment déployer l'application web sur Google Cloud Run.

## 📋 Prérequis

- Compte Google Cloud Platform actif
- `gcloud` CLI installé et configuré
- Docker installé (pour tests locaux)
- Projet GCP créé avec facturation activée

## 🔧 Configuration initiale

### 1. Installer les dépendances

```bash
cd ombres-du-son-web
npm install
```

### 2. Activer les APIs GCP nécessaires

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  artifactregistry.googleapis.com
```

### 3. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

## 🐳 Test local avec Docker

### Build l'image Docker

```bash
docker build -t ombres-du-son-web .
```

### Lancer le conteneur localement

```bash
docker run -p 8080:8080 \
  -e NODE_ENV=development \
  ombres-du-son-web
```

Accéder à http://localhost:8080

## 🚀 Déploiement sur Cloud Run

### Option 1: Déploiement manuel

#### Staging

```bash
# Build et push l'image
gcloud builds submit --tag gcr.io/PROJECT_ID/ombres-du-son-web

# Déployer sur Cloud Run
gcloud run deploy ombres-du-son-web-staging \
  --image gcr.io/PROJECT_ID/ombres-du-son-web \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=staging
```

#### Production

```bash
gcloud run deploy ombres-du-son-web-production \
  --image gcr.io/PROJECT_ID/ombres-du-son-web \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 100 \
  --set-env-vars NODE_ENV=production
```

### Option 2: Déploiement automatique avec Cloud Build

#### Configurer Cloud Build Trigger

1. Aller dans **Cloud Build** → **Triggers**
2. Créer un nouveau trigger:
   - **Name:** `deploy-web-staging`
   - **Event:** Push to branch
   - **Source:** `staging` branch
   - **Configuration:** Cloud Build configuration file
   - **Location:** `ombres-du-son-web/cloudbuild.yaml`

3. Créer un second trigger pour production:
   - **Name:** `deploy-web-production`
   - **Event:** Push to branch
   - **Source:** `main` branch
   - **Configuration:** Cloud Build configuration file
   - **Location:** `ombres-du-son-web/cloudbuild.yaml`

#### Déployer via Git

```bash
# Staging
git checkout staging
git add .
git commit -m "deploy: update staging"
git push origin staging

# Production
git checkout main
git merge staging
git push origin main
```

### Option 3: Utiliser les GitHub Actions

Les workflows GitHub Actions sont déjà configurés dans `.github/workflows/`:
- `deploy-staging.yml` - Déploie automatiquement sur push vers `staging`
- `deploy-production.yml` - Déploie automatiquement sur push vers `main`

**Secrets GitHub requis:**
- `GCP_SA_KEY` - Clé JSON du Service Account
- `GCP_PROJECT_ID` - ID du projet GCP

## 🔐 Configuration du Service Account

### Créer le Service Account

```bash
# Créer le service account
gcloud iam service-accounts create cloud-run-deployer \
  --display-name="Cloud Run Deployer"

# Attribuer les rôles nécessaires
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:cloud-run-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:cloud-run-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:cloud-run-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Créer et télécharger la clé
gcloud iam service-accounts keys create key.json \
  --iam-account=cloud-run-deployer@PROJECT_ID.iam.gserviceaccount.com
```

### Ajouter la clé aux GitHub Secrets

```bash
# Encoder la clé en base64
cat key.json | base64 -w 0

# Copier le résultat et l'ajouter comme secret GitHub: GCP_SA_KEY
```

## 🌐 Configuration du domaine personnalisé

### Mapper un domaine à Cloud Run

```bash
# Ajouter le mapping de domaine
gcloud run domain-mappings create \
  --service ombres-du-son-web-production \
  --domain les-ombres-du-son.app \
  --region europe-west1

# Pour staging
gcloud run domain-mappings create \
  --service ombres-du-son-web-staging \
  --domain staging.les-ombres-du-son.app \
  --region europe-west1
```

### Configurer les DNS

Ajouter les enregistrements DNS fournis par Cloud Run dans votre registrar.

## 📊 Monitoring et Logs

### Voir les logs

```bash
# Logs en temps réel
gcloud run services logs tail ombres-du-son-web-production \
  --region europe-west1

# Logs récents
gcloud run services logs read ombres-du-son-web-production \
  --region europe-west1 \
  --limit 50
```

### Métriques dans Cloud Console

1. Aller dans **Cloud Run** → **Services**
2. Sélectionner le service
3. Onglet **Metrics** pour voir:
   - Requêtes/seconde
   - Latence
   - Utilisation CPU/Mémoire
   - Instances actives

## 🔄 Rollback

### Revenir à une version précédente

```bash
# Lister les révisions
gcloud run revisions list \
  --service ombres-du-son-web-production \
  --region europe-west1

# Rollback vers une révision spécifique
gcloud run services update-traffic ombres-du-son-web-production \
  --to-revisions REVISION_NAME=100 \
  --region europe-west1
```

## 🧪 Tests de santé

### Health check

```bash
# Test local
curl http://localhost:8080/

# Test staging
curl https://staging.les-ombres-du-son.app/

# Test production
curl https://les-ombres-du-son.app/
```

### Load testing

```bash
# Installer Apache Bench
sudo apt-get install apache2-utils

# Test de charge
ab -n 1000 -c 10 https://staging.les-ombres-du-son.app/
```

## 💰 Estimation des coûts

### Staging (faible trafic)
- **Instances:** 0-10 (auto-scaling)
- **Mémoire:** 512Mi
- **CPU:** 1 vCPU
- **Coût estimé:** 5-20€/mois

### Production (trafic modéré)
- **Instances:** 1-100 (auto-scaling)
- **Mémoire:** 1Gi
- **CPU:** 2 vCPU
- **Min instances:** 1 (toujours actif)
- **Coût estimé:** 50-200€/mois

**Note:** Les coûts réels dépendent du trafic et de l'utilisation.

## 🔧 Optimisations

### Réduire les coûts

1. **Staging:** Mettre `min-instances` à 0
2. **Production:** Ajuster selon le trafic réel
3. **Utiliser le CDN** pour les assets statiques
4. **Activer la compression** gzip

### Améliorer les performances

1. **Augmenter la mémoire** si nécessaire
2. **Utiliser Cloud CDN** pour le cache
3. **Optimiser les images** avant le build
4. **Activer HTTP/2** (activé par défaut sur Cloud Run)

## 📚 Ressources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Astro SSR Guide](https://docs.astro.build/en/guides/server-side-rendering/)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Container Registry](https://cloud.google.com/container-registry/docs)

## ✅ Checklist de déploiement

- [ ] APIs GCP activées
- [ ] Service Account créé avec les bons rôles
- [ ] Secrets GitHub configurés
- [ ] Build Docker testé localement
- [ ] Déploiement staging réussi
- [ ] Tests fonctionnels sur staging
- [ ] Domaine personnalisé configuré
- [ ] Monitoring et alertes configurés
- [ ] Déploiement production réussi
- [ ] Tests de charge effectués
- [ ] Documentation à jour
