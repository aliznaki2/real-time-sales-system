# Système de Gestion des Ventes

Projet de gestion de ventes en ligne avec notifications en temps réel, réalisé dans le cadre de mon cours de développement web.

## Description

Ce projet est un système complet de vente en ligne qui permet de gérer des produits, des commandes et de suivre les statistiques de vente en temps réel. Il inclut un système de notifications instantanées pour les administrateurs.

## Technologies utilisées

**Backend :**
- Node.js avec Express
- MongoDB avec Mongoose
- Socket.IO pour le temps réel
- JWT pour l'authentification

**Frontend :**
- Next.js 14
- Socket.IO Client
- Axios pour les requêtes HTTP

## Fonctionnalités principales

- Inscription et connexion avec gestion des rôles (Admin, User)
- Gestion des produits (création, suppression)
- Système de commandes avec gestion automatique du stock
- Dashboard avec statistiques en temps réel
- Notifications instantanées pour les nouvelles commandes (admin uniquement)
- Calcul automatique des ventes quotidiennes

## Installation

### Prérequis
- Node.js installé
- MongoDB installé et démarré

### Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier backend :
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/sales-system
JWT_SECRET=votre_secret_ici
CLIENT_URL=http://localhost:3000
```

Lancer le serveur :
```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Créer un fichier `.env.local` dans le dossier frontend :
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Lancer l'application :
```bash
npm run dev
```

## Utilisation

1. Créer un compte avec le rôle Admin sur http://localhost:3000/register
2. Se connecter avec ce compte
3. Ajouter des produits via la page Products
4. Créer des commandes via la page Orders
5. Consulter les statistiques sur le Dashboard

## Structure du projet

```
backend/
├── src/
│   ├── models/          # Modèles de données MongoDB
│   ├── controllers/     # Logique des routes
│   ├── routes/          # Définition des routes API
│   ├── middleware/      # Middleware d'authentification
│   ├── config/          # Configuration base de données
│   ├── events/          # Système d'événements
│   ├── sockets/         # WebSocket
│   ├── jobs/            # Tâches automatiques
│   └── server.js        # Point d'entrée

frontend/
├── src/
│   ├── app/             # Pages Next.js
│   ├── components/      # Composants réutilisables
│   ├── context/         # Context API
│   ├── hooks/           # Hooks personnalisés
│   └── utils/           # Fonctions utilitaires
```

## Routes API

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `POST /api/orders` - Créer une commande
- `GET /api/orders/my-orders` - Mes commandes
- `GET /api/sales/today` - Statistiques du jour

## Améliorations possibles

- Ajouter des images pour les produits
- Implémenter un système de panier
- Ajouter des filtres et une recherche
- Créer des graphiques pour les statistiques
- Ajouter l'export des données en EXCEL
