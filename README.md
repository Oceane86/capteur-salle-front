# Digital Campus - Frontend

Frontend de l'application Digital Campus pour la gestion et la surveillance des salles.  
Construit avec **Next.js 13**, **TypeScript**, **Tailwind CSS** et **Recharts**.


## Table des matières

- [Présentation](#présentation)
- [Arborescence](#arborescence)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)

## Présentation

Ce projet frontend permet aux utilisateurs (étudiants et administrateurs) de :

- Visualiser l'état des salles (température, CO₂, humidité, luminosité, bruit…)
- Consulter l'historique des mesures
- Réserver une salle ou consulter le planning
- Recevoir des alertes sur le confort des salles

## Arborescence
```
src/
 └─ app/
      ├─ student/
      │    └─ room/[roomId]/page.tsx
      ├─ admin/
      │    └─ room/[roomId]/page.tsx
      └─ components/
           ├─ Navbar.tsx
           ├─ StatusBadge.tsx
           ├─ ReservationModal.tsx
           ├─ ScheduleModal.tsx
           └─ Toast.tsx
 └─ lib/
      └─ api.ts
```

**app/ :** pages et routes principales pour étudiants et administrateurs

**components/ :** composants réutilisables (modals, badges, navbar…)

**lib/api.ts :** fonctions pour communiquer avec l’API backend

## Fonctionnalités
- Affichage des mesures en temps réel
- Historique des mesures sous forme de graphiques
- Indice de confort automatique
- Alerte pour les niveaux de CO₂ élevés
- Réservation de salles avec raisons personnalisées
- Consultation du planning des salles
- Interface adaptée pour étudiants et administrateurs
- Accessibilité et bonnes pratiques (ARIA, roles, labels)

## Technologies utilisées

- [Next.js 13](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [API externe](https://github.com/EmmaRinaldo/Capteur-Salle-Back) pour récupérer et créer les données de réservation et mesures



## Prérequis

Avant d’installer le projet, assurez-vous d’avoir :

- Node.js ≥ 18
- npm ou yarn
- Accès à l’API backend (URL à configurer via `.env.local`)


## Installation

1. Cloner le repository :

```
git clone <URL_DU_REPO>
cd digital-campus-frontend
```

2. Installer les dépendances :
```
npm install
# ou
yarn install
```

3. Créer un fichier .env.local à la racine avec vos variables d'environnement :
```
NEXT_PUBLIC_API_URL=https://api.digitalcampus.com
```

4. Lancer le projet en mode développement :
```
npm run dev
# ou
yarn dev
```