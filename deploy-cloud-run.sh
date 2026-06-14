#!/bin/bash
set -e

echo "🚀 Déploiement Cloud Run - Les Ombres du Son"

# Variables
PROJECT_ID="les-ombres-du-son-483614"
SERVICE_NAME="ombres-du-son-web-staging"
REGION="europe-west1"

# Build et déploiement
echo "📦 Build et déploiement en cours..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --quiet

echo "✅ Déploiement terminé !"
echo "🌐 URL: https://$SERVICE_NAME-346375999456.$REGION.run.app"
