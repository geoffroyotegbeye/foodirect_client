Write-Host "🚀 Migration de React + Vite vers Next.js" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Créer le dossier public/assets
Write-Host "📁 Création du dossier public/assets..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "public/assets" | Out-Null

# Étape 2: Déplacer les images
Write-Host "🖼️  Déplacement des images..." -ForegroundColor Yellow
if (Test-Path "src/assets") {
    Copy-Item "src/assets/*.png" -Destination "public/assets/" -ErrorAction SilentlyContinue
    Write-Host "✅ Images copiées vers public/assets/" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dossier src/assets introuvable, images déjà déplacées?" -ForegroundColor DarkYellow
}

# Étape 3: Supprimer les anciens fichiers Vite
Write-Host "🗑️  Suppression des anciens fichiers Vite..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "src" -ErrorAction SilentlyContinue
Remove-Item -Force "index.html" -ErrorAction SilentlyContinue
Remove-Item -Force "vite.config.js" -ErrorAction SilentlyContinue
Remove-Item -Force "eslint.config.js" -ErrorAction SilentlyContinue
Write-Host "✅ Anciens fichiers supprimés" -ForegroundColor Green

# Étape 4: Nettoyer node_modules
Write-Host "🧹 Nettoyage des dépendances..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
Write-Host "✅ Ancien node_modules supprimé" -ForegroundColor Green

# Étape 5: Installer les dépendances Next.js
Write-Host "📦 Installation des dépendances Next.js..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✨ Migration terminée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour lancer le projet :" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Votre application sera disponible sur http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
