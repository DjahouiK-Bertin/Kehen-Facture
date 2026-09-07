# Documentation du Projet KEHENFacture (Contexte IA)

Ce fichier sert de point de référence pour tout modèle IA (notamment Gemini) travaillant sur le projet **KEHENFacture**. Il résume l'état actuel de l'application, ses fonctionnalités, sa structure, ses technologies et les directives de développement.

## 1. À propos de l'application
**KEHENFacture** est une application web SaaS (Software as a Service) de gestion financière conçue principalement pour les entrepreneurs, freelances et petites entreprises (orientée vers le marché africain, avec le **FCFA** comme devise par défaut). 

Elle permet de gérer les factures, les clients, de suivre les budgets, d'analyser les rapports financiers via des tableaux de bord dynamiques, et de gérer les paramètres de l'entreprise.

## 2. Fonctionnalités Implémentées (Fullstack)
L'application est passée du stade de maquette statique à une **application Fullstack fonctionnelle** connectée à Supabase (PostgreSQL & Auth).

- **Authentification** : Inscription, connexion, et protection des routes privées (Next.js Middleware + Supabase Auth).
- **Dashboard (Accueil)** : Vue d'ensemble avec des statistiques (Revenus, Factures en attente, Dépenses) et la liste de l'activité récente, calculées dynamiquement.
- **Transactions** : Historique complet des mouvements financiers (revenus et dépenses).
- **Invoices (Factures)** : 
  - Liste dynamique des factures (filtrable).
  - Générateur de facture (`/invoices/new`) connecté à la base avec calcul automatique, liaison aux clients, et gestion du logo.
- **Clients** : Répertoire complet des clients (CRUD : Création, Lecture, Modification, Suppression).
- **Budgeting** : Suivi dynamique des budgets par catégories avec calcul des dépenses par rapport à la limite fixée.
- **Rapports (Reports)** : Graphiques et statistiques analytiques (ex: 6 derniers mois) basés sur les vraies transactions en base de données.
- **Paramètres (Settings)** : Formulaires pour modifier le profil utilisateur (profiles) et les préférences de l'entreprise (settings : devise, TVA, conditions).
- **Wallet** : (*En attente*) L'interface est actuellement masquée (Coming Soon) en attendant une future mise à jour.

## 3. Technologies Utilisées
- **Framework Frontend** : Next.js 14/15 (App Router), React, TypeScript.
- **Styling** : Tailwind CSS (pur, sans librairie de composants externe).
- **Icônes** : `lucide-react`.
- **Backend & Base de données** : Supabase.
  - **Base de données** : PostgreSQL.
  - **Auth** : Supabase Authentication.
  - **Client** : `@supabase/supabase-js` et `@supabase/ssr` pour les cookies.
- **Architecture de requêtes** : Next.js Server Actions (pour les mutations) et Server Components (pour la lecture).

## 4. Structure des Fichiers
```
KEHENFacture/
├── src/
│   ├── app/
│   │   ├── auth/                # Callback d'authentification Supabase
│   │   ├── dashboard/           # Toutes les pages privées (Server Components)
│   │   │   ├── budgeting/       
│   │   │   ├── clients/         
│   │   │   ├── components/      # (Sidebar, Topbar)
│   │   │   ├── invoices/        
│   │   │   ├── reports/         
│   │   │   ├── settings/        
│   │   │   ├── transactions/    
│   │   │   └── wallet/          
│   │   ├── login/               # Page de connexion
│   │   ├── signup/              # Page d'inscription
│   │   ├── globals.css          # Styles globaux Tailwind
│   │   └── layout.tsx           # Layout principal
│   ├── components/
│   │   └── shared/              # Composants UI (Logo, Toast, etc.)
│   └── lib/
│       ├── actions/             # Next.js Server Actions (ex: clients.ts)
│       └── supabase/            # Configuration client et serveur Supabase
├── supabase_schema.sql          # Schéma de la base de données PostgreSQL
└── GEMINI.md                    # Ce fichier de contexte
```

## 5. Décisions de Design (UI/UX)
- **Framework CSS** : Tailwind CSS.
- **Esthétique** : Design moderne, "clean" et premium (bords arrondis `rounded-xl`, ombres douces `shadow-sm`, boutons avec `active:scale-95`).
- **Interactivité** : Utilisation de modales (pop-ups) avec arrière-plan flouté (`backdrop-blur-sm`, `bg-black/50`).
- **Composants "From Scratch"** : Les composants ne s'appuient pas sur une librairie externe (pas de Shadcn UI) ; ils sont codés de zéro.
- **Devise** : Toujours utiliser le code de devise stocké dans les `settings` de l'utilisateur (par défaut FCFA).

## 6. Instructions pour les Modèles IA Futurs (IMPORTANT)
1. **Application Connectée** : L'application n'est plus une simple maquette. **Toute nouvelle fonctionnalité doit être implémentée en Fullstack** en se connectant à Supabase via le client `@supabase/ssr`.
2. **Mutations de données** : Utilisez TOUJOURS les **Server Actions** (`"use server"`) situées dans `src/lib/actions/` pour insérer, modifier ou supprimer des données (ex: `addClient`, `updateClient`).
3. **Sécurité et RLS** : La base de données Supabase est configurée avec des politiques Row Level Security (RLS). Assurez-vous que l'ID de l'utilisateur (`user.id`) est toujours géré correctement.
4. **Pas d'ORM externe** : Ne proposez pas d'installer Prisma ou Drizzle. Le projet utilise le SDK officiel Supabase.
5. **Composants Clients vs Serveurs** : Suivez le pattern d'isoler la logique interactive dans des `*-client.tsx` (ex: `clients-client.tsx`) et la récupération de données (fetching) dans `page.tsx` (Server Component).
6. **Design Consistant** : Respectez l'esthétique premium actuelle lors de la création de nouveaux composants.
