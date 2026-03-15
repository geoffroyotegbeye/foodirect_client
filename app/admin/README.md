# 👨‍💼 Admin Dashboard - FOODIRECT

Dashboard d'administration pour gérer le restaurant FOODIRECT.

## 🔐 Accès

**URL:** `http://localhost:3000/admin`

**Identifiants:**
- Email: `admin@foodirect.com`
- Mot de passe: `admin123`

## 📁 Structure

```
admin/
├── page.js              # Dashboard principal (protégé)
├── login/
│   └── page.js         # Page de connexion
└── README.md           # Ce fichier
```

## 🛡️ Protection

- Vérification automatique du token JWT
- Vérification du rôle admin
- Redirection vers `/admin/login` si non authentifié
- Stockage sécurisé dans localStorage

## 🎯 Fonctionnalités

### Actuelles
- ✅ Authentification JWT
- ✅ Dashboard avec statistiques
- ✅ Actions rapides
- ✅ Déconnexion

### À venir
- ⏳ Gestion du menu (CRUD)
- ⏳ Gestion des commandes
- ⏳ Statistiques détaillées
- ⏳ Gestion des utilisateurs

## 📖 Documentation

Voir: `docs/ADMIN_GUIDE.md` pour le guide complet
