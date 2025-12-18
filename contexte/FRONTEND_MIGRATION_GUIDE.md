# Guide de Migration API pour l'Équipe Frontend (Angular)

**Version:** 2.0 (Changements Majeurs)
**Date:** 2025-12-12

## Introduction

Ce document détaille les changements récents et majeurs apportés à l'API AEMUD. Ces modifications améliorent la sécurité, la robustesse et la clarté des réponses de l'API. Une mise à jour du code de l'application frontend est **nécessaire** pour assurer la compatibilité.

---

## 1. Changement Majeur : Stratégie d'Authentification (Cookies `HttpOnly`)

*C'est le changement le plus important avec un impact direct sur la sécurité et la gestion de la session. L'objectif est de ne plus jamais exposer le token JWT au code JavaScript côté client.*

### Ce qui change
Le token JWT n'est **PLUS** retourné dans la réponse JSON du endpoint `POST /auth/authenticate`.

### Actions Requises

#### a) Logique de Connexion (Login)
-   **À SUPPRIMER :** La récupération du token (`jwt`) depuis le corps de la réponse de login.
-   **À SUPPRIMER :** Le stockage du token dans le `localStorage` ou `sessionStorage`.
-   **Information :** Le backend positionne maintenant un cookie nommé `aemud-jwt` avec les attributs `HttpOnly` et `Secure` (en production). Le navigateur gérera automatiquement sa transmission pour toutes les requêtes suivantes vers l'API.

#### b) Requêtes Authentifiées (HttpInterceptor)
-   **À SUPPRIMER :** La logique dans votre `HttpInterceptor` Angular qui ajoute l'en-tête `Authorization: Bearer <token>` aux requêtes sortantes. Cet en-tête n'est plus utilisé pour l'authentification de session.

#### c) Logique de Déconnexion (Logout)
-   **À MODIFIER :** La déconnexion ne se fait plus en supprimant simplement le token du `localStorage`.
-   **Action :** Il faut maintenant impérativement appeler le nouvel endpoint : `POST /auth/logout`.
-   **Effet :** Cet appel demandera au backend d'envoyer une instruction au navigateur pour effacer le cookie d'authentification, ce qui déconnectera l'utilisateur de manière sécurisée.

---

## 2. Nouvelle Structure Standardisée pour les Réponses d'Erreur

*Objectif : Fournir des retours d'erreur clairs, structurés et directement exploitables pour les formulaires.*

### Ce qui change
Toutes les réponses d'erreur (codes `4xx`) suivent maintenant la même structure `ResponseVO`. Le champ `message` contient un message d'erreur global, et le nouveau champ `errors` (une liste) contient les détails spécifiques à chaque champ du formulaire.

### Nouvelle Réponse d'Erreur (Exemple pour une erreur de validation)
```json
{
  "success": false,
  "message": "Validation Failed",
  "data": null,
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    },
    {
      "field": "username",
      "message": "Username must be a valid email address"
    }
  ]
}
```

### Action Requise
-   Mettre à jour la logique de gestion des erreurs dans vos services de données Angular pour parser cette nouvelle structure.
-   **Fortement recommandé :** Utiliser la liste `errors` pour afficher des messages d'erreur spécifiques à côté de chaque champ de formulaire (par exemple, sous les `mat-form-field` d'Angular Material). Cela améliore considérablement l'expérience utilisateur.
-   Le champ `message` global peut être utilisé pour un message de notification général de type "toast" (ex: "Le formulaire contient des erreurs").

---

## 3. Changement du Type des Identifiants (ID) pour les Utilisateurs

*Objectif : Standardiser les identifiants à travers toute l'API pour plus de sécurité et de cohérence.*

### Ce qui change
Les identifiants pour les entités du module `user` (`User`, `Role`) ne sont plus des nombres (`Long`) mais des **chaînes de caractères** (`String`) au format UUID.

### Impact et Actions Requises
-   **Modèles de données :** Dans vos interfaces ou classes TypeScript (ex: `user.ts`), changer le type des champs `id` concernés de `number` à `string`.
-   **Construction d'URL :** Vérifier tous les services qui construisent des URLs (ex: `/users/{id}`) et s'assurer que l'ID est bien traité comme une chaîne de caractères.

---

## 4. Nouveaux Endpoints et Codes de Statut

-   **Nouvel Endpoint :** `POST /auth/logout` est maintenant disponible et doit être utilisé pour la déconnexion.
-   **Codes de statut plus précis :** L'API retourne maintenant des codes HTTP plus sémantiques qui peuvent être utilisés pour une logique client plus fine :
    -   `409 CONFLICT` : Indique une violation de règle métier (ex: un utilisateur avec cet email existe déjà, ou un membre a déjà un compte). Peut être utilisé pour afficher un message d'erreur très spécifique à l'utilisateur.
    -   `400 BAD REQUEST` : Utilisé principalement pour les erreurs de validation (voir point 2).
    -   `404 NOT FOUND` : Pour les ressources qui n'existent pas.
