# aemud-frontend - Application de Gestion (AEMUD)

Cette application front-end, développée avec Angular, est conçue pour la gestion des membres, des contributions et des tâches administratives d'une association. Elle intègre une authentification robuste, un contrôle d'accès basé sur les rôles, et une architecture modulaire pour une maintenance et une évolutivité facilitées.

## Technologies Utilisées

*   **Framework :** Angular (version spécifiée dans `package.json`)
*   **Langage :** TypeScript
*   **Gestion d'état asynchrone :** RxJS
*   **Styling :** SCSS, Bootstrap
*   **Tests :** Karma, Jasmine
*   **Qualité de code :** ESLint
*   **Outils de build :** Angular CLI
*   **Intégration API :** RESTful API

## Fonctionnalités Principales

*   **Authentification Utilisateur :** Connexion, déconnexion, changement de mot de passe, gestion de la première connexion.
*   **Contrôle d'Accès :** Protection des routes et des fonctionnalités basée sur les rôles (Super Administrateur, Administrateur, Utilisateur) via Angular Guards.
*   **Gestion des Données :** Modules dédiés à la gestion des membres, des phases de mandat, des contributions et des notifications.
*   **Interface Réactive :** Design responsive adapté à différentes tailles d'écran.
*   **Optimisation des Performances :** Utilisation du lazy loading pour les modules feature.
*   **Gestion des Erreurs :** Intercepteurs HTTP globaux pour gérer les erreurs API (ex: 401 Unauthorized, 403 Forbidden).

## Démarrage Rapide

### Prérequis

Assurez-vous d'avoir les éléments suivants installés :
*   Node.js (LTS version recommandée)
*   npm (normalement inclus avec Node.js) ou Yarn
*   Angular CLI (`npm install -g @angular/cli`)

### Installation

1.  Clonez le dépôt :
    ```bash
    git clone [URL_DU_DEPOT]
    ```
2.  Naviguez vers le répertoire du projet :
    ```bash
    cd aemud-frontend
    ```
3.  Installez les dépendances :
    ```bash
    npm install # ou yarn install
    ```

### Configuration

L'URL de l'API backend est configurée dans les fichiers d'environnement. Modifiez `src/environments/environment.ts` (ou `environment.development.ts` pour le développement local) pour pointer vers votre instance backend :

```typescript
export const environment = {
  production: false,
  API_URL: 'http://localhost:8080/api', // Adaptez selon votre configuration backend
};
```

## Scripts de Développement

*   **Serveur de développement :** Lance le serveur de développement local. L'application sera disponible sur `http://localhost:4200/`. Les changements de fichiers seront automatiquement rechargés.
    ```bash
    ng serve
    ```
*   **Build de production :** Construit l'application pour le déploiement en production. Les fichiers de sortie seront placés dans le dossier spécifié par `outputPath` dans `angular.json` (ex: `dist/`).
    ```bash
    ng build --configuration production
    ```
*   **Tests unitaires :** Exécute les tests unitaires via Karma.
    ```bash
    ng test
    ```
*   **Linting :** Vérifie le code source pour les erreurs de style et de potentiel problème via ESLint.
    ```bash
    ng lint
    ```

## Architecture du Projet

Le projet suit une structure modulaire typique des applications Angular de taille moyenne à grande :

*   `src/app/core/` : Contient les services singleton, guards, interceptors, modèles de données partagés.
*   `src/app/features/` : Regroupe les modules métier spécifiques à une fonctionnalité (ex: `auth`, `member`, `contribution`).
*   `src/app/shared/` : Composants réutilisables, pipes, directives partagés entre plusieurs modules feature.

## Captures d'écran

Voici quelques aperçus de l'application en action.

### Authentification
*   **Page de connexion**
    ![Page de connexion](assets/screenshots/auth-login.png)

### Membres
*   **Liste des membres**
    ![Liste des membres](assets/screenshots/member-list.png)
*   **Ajout d'un membre (formulaire multipage)**
    ![Ajout d'un membre](assets/screenshots/member-add.png)
*   **Détail d'un membre (avec calendrier de cotisations)**
    ![Détail d'un membre](assets/screenshots/member-detail.png)

### Configuration
*   **Tableau de bord de Configuration (avec onglets Clubs/Commissions/Bourses)**
    ![Tableau de bord de Configuration](assets/screenshots/config-dashboard.png)
*   **Liste des Périodes de Mandat**
    ![Liste des Périodes de Mandat](assets/screenshots/config-mandat-list.png)
*   **Création/Modification d'une Période de Mandat (avec gestion des phases)**
    ![Création/Modification d'une Période de Mandat](assets/screenshots/config-mandat-add-edit.png)

### Notifications
*   **Tableau de bord des Notifications (Admin)**
    ![Tableau de bord des Notifications](assets/screenshots/notif-dashboard.png)
*   **Liste des Campagnes de Communication**
    ![Liste des Campagnes de Communication](assets/screenshots/notif-campaigns-list.png)
*   **Envoi de SMS immédiat**
    ![Envoi de SMS immédiat](assets/screenshots/notif-sms-instant.png)
*   **Gestion des Modèles de SMS/Email**
    ![Gestion des Modèles](assets/screenshots/notif-templates.png)

### Utilisateurs
*   **Liste des utilisateurs**
    ![Liste des utilisateurs](assets/screenshots/user-list.png)
*   **Création/Modification d'un utilisateur (avec sélection de membre et rôles)**
    ![Création/Modification d'un utilisateur](assets/screenshots/user-add.png)
*   **Détail d'un utilisateur**
    ![Détail d'un utilisateur](assets/screenshots/user-detail.png)

## Auteur

**Boubacar Diallo**
*   GitHub : [http://github.com/ciidii](http://github.com/ciidii)
