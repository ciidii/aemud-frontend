# Feuille de Route pour la Refactorisation de l'Authentification

Ce document détaille les étapes pour refactoriser la fonctionnalité d'authentification de l'application. L'objectif est de passer d'une implémentation non sécurisée et codée en dur à une structure robuste, modulaire et prête pour l'intégration d'un backend.

## Phase 1 : Mise en Place des Fondations et de la Logique de Connexion

-   [ ] **1. Créer un `AuthService` :**
    -   Créer le fichier `src/app/features/auth/services/auth.service.ts`.
    -   Ce service centralisera toute la logique d'authentification.
    -   Il exposera une méthode `login(credentials)` qui, pour l'instant, simulera un appel HTTP.

-   [ ] **2. Créer un `SessionService` :**
    -   Créer le fichier `src/app/core/services/session.service.ts`.
    -   Ce service sera responsable de la gestion de la session utilisateur (par exemple, stocker et récupérer un token de session dans le `localStorage`).
    -   Il exposera des méthodes comme `saveToken(token)`, `getToken()`, `clearSession()`, et un `Observable` ou `Signal` pour suivre l'état de connexion (`isLoggedIn$`).

-   [ ] **3. Créer un Modèle `User` :**
    -   Créer le fichier `src/app/core/models/user.model.ts` pour définir la structure d'un objet utilisateur.

-   [ ] **4. Mettre à Jour le `LoginComponent` :**
    -   Injecter `AuthService` et `Router`.
    -   Supprimer la logique de connexion codée en dur.
    -   Appeler la méthode `authService.login()` et, en cas de succès, utiliser le `Router` pour rediriger l'utilisateur.

## Phase 2 : Sécurisation des Routes

-   [ ] **1. Créer un `AuthGuard` :**
    -   Créer le fichier `src/app/core/guards/auth.guard.ts`.
    -   Ce "guard" protégera les routes qui nécessitent une authentification.
    -   Il vérifiera la présence d'un token de session en utilisant le `SessionService`. Si l'utilisateur n'est pas connecté, il le redirigera vers la page de connexion.

-   [ ] **2. Mettre à Jour la Configuration du Routage :**
    -   Appliquer `AuthGuard` aux routes protégées de l'application (par exemple, le "layout" principal ou les "features" après connexion).

## Phase 3 : Gestion de la Déconnexion et de l'État Global

-   [ ] **1. Implémenter la Déconnexion :**
    -   Ajouter une méthode `logout()` dans `AuthService` qui appellera `sessionService.clearSession()`.
    -   Ajouter un bouton de déconnexion dans l'interface (par exemple, dans le `HeaderComponent`) qui déclenche cette méthode.

-   [ ] **2. Affichage Conditionnel :**
    -   Utiliser l'état de connexion du `SessionService` (`isLoggedIn$`) pour afficher ou masquer conditionnellement des éléments de l'interface (par exemple, afficher "Login" si déconnecté, et "Logout" si connecté).

## Phase 4 : Finalisation et Fonctionnalités Annexes

-   [ ] **1. Implémenter la Logique de "Mot de Passe Oublié" (Simulation) :**
    -   Dans `PasswordForgottenComponent`, ajouter un formulaire simple.
    -   Simuler l'envoi d'un email de réinitialisation (par exemple, afficher un message de confirmation à l'utilisateur).

-   [ ] **2. Gestion des Erreurs :**
    -   Dans le `LoginComponent`, gérer les erreurs d'authentification retournées par le `AuthService` (par exemple, "nom d'utilisateur ou mot de passe incorrect") et afficher un message à l'utilisateur.

-   [ ] **3. Nettoyage du Code :**
    -   Supprimer les anciens fichiers ou le code devenu obsolète après le refactoring.