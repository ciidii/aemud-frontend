# Guide d'Intégration Frontend : Améliorations du Module Utilisateur

**Date :** 2026-01-01

## 1. Introduction

Ce document est destiné à l'équipe frontend. Il détaille les récentes améliorations et corrections apportées au module de gestion des utilisateurs de l'API AEMUD. Ces changements renforcent la sécurité, ajoutent de nouvelles fonctionnalités et corrigent des comportements inattendus. Une mise à jour du code client est nécessaire pour intégrer ces évolutions.

---

## 2. Nouvelles Fonctionnalités et Endpoints

### 2.1. Statistiques des Utilisateurs

Une nouvelle route a été ajoutée pour fournir des statistiques sur la base d'utilisateurs.

- **Endpoint :** `GET /users/stats`
- **Description :** Retourne un objet contenant le nombre total d'utilisateurs, le nombre d'utilisateurs actifs (non-verrouillés) et le nombre d'utilisateurs verrouillés.
- **Réponse type :**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 150,
      "activeUsers": 145,
      "lockedUsers": 5
    }
  }
  ```
- **Note importante sur les permissions :**
  - Si la requête est faite par un `ADMIN`, les statistiques **excluent** les comptes `SUPER_ADMIN`.
  - Si la requête est faite par un `SUPER_ADMIN`, les statistiques incluent **tous** les comptes.
- **Action Frontend :** Utiliser cet endpoint pour alimenter un tableau de bord administratif avec des indicateurs clés sur les utilisateurs.

### 2.2. Suppression d'Utilisateur

Un endpoint a été ajouté pour permettre la suppression de comptes utilisateurs.

- **Endpoint :** `DELETE /users/{id}`
- **Permissions :** Cet endpoint est **strictement réservé aux `SUPER_ADMIN`s**.
- **Logique de suppression (Hybride) :**
  - Si l'utilisateur à supprimer n'a **jamais eu d'activité** (aucune connexion enregistrée), il est **supprimé définitivement** (Hard Delete).
  - Si l'utilisateur **a déjà été actif**, il est **archivé** (Soft Delete) : son compte est verrouillé, ses données personnelles (email, mot de passe) sont invalidées pour la sécurité, et le lien avec son profil `Member` est coupé.
- **Action Frontend :**
  1.  Dans l'interface de gestion des utilisateurs, ajouter un bouton "Supprimer".
  2.  Assurer que ce bouton n'est visible et accessible **uniquement** pour les utilisateurs ayant le rôle `SUPER_ADMIN`.
  3.  Prévoir une modale de confirmation avant d'appeler l'API de suppression.

### 2.3. Journalisation des Connexions

- **Description :** Le backend enregistre désormais des informations de sécurité à chaque connexion réussie (adresse IP, `User-Agent`).
- **Action Frontend :** Aucune action immédiate n'est requise. Ces données sont collectées pour des besoins futurs de sécurité et d'audit (par exemple, pour afficher les sessions actives d'un utilisateur). Un endpoint pour consulter cet historique pourra être développé sur demande.

---

## 3. Changements sur les Endpoints Existants

### 3.1. Création d'Utilisateur (`POST /users`)

Le corps de la requête (`UserRequestDto`) a été enrichi pour plus de flexibilité.

- **Nouveau champ :** `forcePasswordChange` (boolean, optionnel).
- **Comportement :**
  - Si ce champ est omis ou mis à `true`, le comportement reste le même : l'utilisateur devra changer son mot de passe à sa première connexion.
  - Si ce champ est mis à `false`, l'utilisateur est créé avec son mot de passe temporaire et n'est pas forcé de le changer.
- **Action Frontend :** Dans le formulaire de création d'un utilisateur, ajouter une option (ex: une case à cocher) "Forcer le changement de mot de passe à la première connexion", activée par défaut.

---

## 4. Corrections de Bugs et Améliorations de Sécurité

Ces changements ont été implémentés côté backend et peuvent nécessiter une vérification de la gestion des erreurs côté frontend.

### 4.1. Déconnexion Forcée des Utilisateurs Bloqués

- **Correction :** Un utilisateur dont le compte est verrouillé (`locked: true`) sera désormais **immédiatement déconnecté**.
- **Impact :** Toute requête API effectuée avec le token d'un utilisateur bloqué résultera en une erreur `403 Forbidden` (ou `401 Unauthorized` selon la configuration finale du pare-feu de sécurité).
- **Action Frontend :** Confirmer que l'intercepteur HTTP gère correctement ces codes d'erreur en redirigeant l'utilisateur vers la page de connexion et en nettoyant toute donnée de session locale.

### 4.2. Permissions de Blocage/Déblocage Affinées

- **Correction :** La logique de permission pour bloquer/débloquer un utilisateur a été renforcée.
- **Nouvelles règles :**
  - Un `ADMIN` **ne peut pas** bloquer un autre `ADMIN`.
  - Personne (pas même un autre `SUPER_ADMIN`) **ne peut** bloquer un `SUPER_ADMIN`.
  - Un `ADMIN` peut bloquer un `USER`.
  - Un `SUPER_ADMIN` peut bloquer un `ADMIN` ou un `USER`.
- **Action Frontend (Recommandation UX) :** Dans l'interface de liste des utilisateurs, masquer ou désactiver le bouton "Bloquer" sur les lignes où l'action n'est pas permise selon les règles ci-dessus.

### 4.3. Accès au Changement de Mot de Passe Initial

- **Correction :** Le bug qui empêchait un nouvel utilisateur avec uniquement le rôle `USER` de changer son mot de passe initial est résolu.
- **Impact :** L'endpoint `POST /users/change-password-first-connection` est maintenant accessible à tout utilisateur authentifié.
- **Action Frontend :** Aucune action de développement n'est normalement nécessaire. Il est juste conseillé de vérifier que le parcours d'un nouvel utilisateur (première connexion -> redirection vers changement de mot de passe -> changement réussi) fonctionne comme attendu.

### 4.4. Réutilisation d'un Membre après Suppression de son Compte

- **Correction :** Le bug qui empêchait de créer un nouveau compte utilisateur pour un membre dont l'ancien compte avait été supprimé (via suppression douce) est résolu.
- **Impact :** Lors d'une suppression douce, le lien entre l'ancien compte `User` et le profil `Member` est coupé, libérant ainsi le membre.
- **Action Frontend :** Aucune action directe requise. Le workflow de création d'un utilisateur pour un membre existant devrait maintenant fonctionner sans erreur, même si ce membre a eu un compte par le passé.
