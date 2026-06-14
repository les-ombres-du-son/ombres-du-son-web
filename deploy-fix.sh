#!/bin/bash
set -e

echo "🔧 Correction du déploiement Cloud Run"
echo "======================================"

# Configuration
PROJECT_ID="les-ombres-du-son-483614"
SERVICE_NAME="ombres-du-son-web-staging"
REGION="europe-west1"

echo ""
echo "📋 Configuration:"
echo "  Projet: $PROJECT_ID"
echo "  Service: $SERVICE_NAME"
echo "  Région: $REGION"
echo ""

# Vérifier si on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis le dossier ombres-du-son-web"
    exit 1
fi

echo "🔑 Authentification gcloud..."
gcloud auth login --brief 2>/dev/null || true

echo ""
echo "⚙️  Configuration du projet..."
gcloud config set project $PROJECT_ID

echo ""
echo "🚀 Déploiement en cours..."
gcloud run deploy $SERVICE_NAME \
    --source . \
    --region $REGION \
    --project $PROJECT_ID \
    --allow-unauthenticated \
    --quiet

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "🌐 URL du service:"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
