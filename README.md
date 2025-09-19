# AEMUD - Portail de Gestion de l'Association

![Logo AEMUD](src/assets/background/logo_aemud_Plan_de_travail_1.png)

Ce projet est une application web front-end développée avec Angular, conçue pour offrir une solution complète de gestion pour une association. Elle permet de gérer les membres, les sessions, les configurations internes, et bien plus encore.

## ✨ Fonctionnalités Clés

-   **Tableau de Bord Intuitif** : Vue d'ensemble des informations importantes de l'association.
-   **Gestion des Membres** : Système CRUD (Créer, Lire, Mettre à jour, Supprimer) complet pour les membres.
-   **Authentification Sécurisée** : Espace de connexion, gestion de mots de passe et protection des routes basée sur les rôles (Admin, Utilisateur).
-   **Configuration Dynamique** : Interface pour les administrateurs pour gérer les sessions, les clubs, les commissions, etc.
-   **Suivi des Contributions** : Visualisation et gestion des cotisations des membres.
-   **Module de Notifications** : Envoi de communications ciblées aux membres.

## 🛠️ Stack Technique

| Domaine              | Technologies                                                              |
| -------------------- | ------------------------------------------------------------------------- |
| **Framework**        | Angular 16+, TypeScript                                                   |
| **Style**            | SCSS, avec une architecture BEM et des variables centralisées             |
| **Gestion d'État**   | Services Angular et RxJS (BehaviorSubject) pour un état réactif et léger  |
| **Qualité de Code**  | ESLint                                                                    |
| **Tests**            | Karma, Jasmine                                                            |
| **Environnement Dev**| Docker, Docker Compose, Nginx, `json-server` pour le mock d'API           |

## 🏛️ Architecture

Le projet est structuré en suivant les meilleures pratiques d'Angular pour garantir la maintenabilité et l'évolutivité :

-   `CoreModule` : Fournit les services singletons, les gardes et les intercepteurs HTTP.
-   `SharedModule` : Contient les composants, directives et pipes réutilisables à travers l'application.
-   `Features Modules` : Chaque fonctionnalité métier (authentification, membres, etc.) est isolée dans son propre module.

## 🚀 Démarrage Rapide

### Prérequis

-   Node.js (version 18.x ou supérieure)
-   npm (version 9.x ou supérieure)
-   Docker et Docker Compose (recommandé)

### Installation et Lancement

1.  **Clonez le dépôt :**
    ```bash
    git clone [URL_DU_REPO]
    cd amued-frontend
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

3.  **Lancez le mock server (API simulée) :**
    *Dans un terminal séparé*, exécutez la commande suivante pour démarrer `json-server` qui servira les données du fichier `data/db.json`.
    ```bash
    npm run start:db
    ```
    *(Note : Il faudra peut-être ajouter le script `"start:db": "json-server --watch data/db.json"` à votre `package.json`)*

4.  **Lancez le serveur de développement Angular :**
    ```bash
    npm start
    ```
    L'application sera accessible à l'adresse `http://localhost:4200/`.

### Utilisation avec Docker

Vous pouvez également lancer l'ensemble de l'environnement (application + mock server) avec Docker Compose.

```bash
docker-compose up --build
```
L'application sera accessible sur `http://localhost:80/`.

## 📦 Commandes Utiles

-   `npm run build` : Compiler le projet pour la production.
-   `npm run test` : Lancer les tests unitaires.
-   `npm run lint` : Analyser la qualité du code avec ESLint.