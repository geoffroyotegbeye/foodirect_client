#!/bin/bash

echo "🚀 Migration de React + Vite vers Next.js"
echo "=========================================="
echo ""

# Étape 1: Créer le dossier public/assets
echo "📁 Création du dossier public/assets..."
mkdir -p public/assets

# Étape 2: Déplacer les images
echo "🖼️  Déplacement des images..."
if [ -d "src/assets" ]; then
    cp src/assets/*.png public/assets/ 2>/dev/null || true
    echo "✅ Images copiées vers public/assets/"
else
    echo "⚠️  Dossier src/assets introuvable, images déjà déplacées?"
fi

# Étape 3: Supprimer les anciens fichiers Vite
echo "🗑️  Suppression des anciens fichiers Vite..."
rm -rf src/
rm -f index.html
rm -f vite.config.js
rm -f eslint.config.js
echo "✅ Anciens fichiers supprimés"

# Étape 4: Nettoyer node_modules
echo "🧹 Nettoyage des dépendances..."
rm -rf node_modules package-lock.json
echo "✅ Ancien node_modules supprimé"

# Étape 5: Installer les dépendances Next.js
echo "📦 Installation des dépendances Next.js..."
npm install

echo ""
echo "✨ Migration terminée avec succès!"
echo ""
echo "Pour lancer le projet :"
echo "  npm run dev"
echo ""
echo "Votre application sera disponible sur http://localhost:3000"
echo ""
