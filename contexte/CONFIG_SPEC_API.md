# Documentation de l'API AEMUD

Ce document détaille la vision UX pour l'interface d'administration ainsi que les points d'accès (endpoints) de l'API pour la gestion des Clubs, Commissions, Bourses et leur relation avec les Membres.

---

# Approche UX pour l'Interface d'Administration

Avant de détailler les endpoints, ce chapitre décrit la vision stratégique pour l'interface utilisateur (UI) qui permettra de gérer les entités de l'application (Clubs, Commissions, Bourses).

## Vision : Une Gestion Centralisée et Structurée

L'objectif est de fournir aux administrateurs une expérience fluide, intuitive et efficace. Pour cela, l'idée de regrouper la gestion de ces entités liées est excellente.

La meilleure approche est de créer un module de **"Paramétrage"** (ou **"Gestion"**) dans l'application Angular. Ce module servira de point d'entrée unique pour la configuration des données qui caractérisent les membres.

## Implémentation : Interface à Onglets

À l'intérieur de ce module, la navigation se fera via des **onglets**, où chaque onglet est dédié à une entité :

- **Onglet "Clubs"**: Interface CRUD pour gérer les clubs.
- **Onglet "Commissions"**: Interface CRUD pour gérer les commissions.
- **Onglet "Bourses"**: Interface CRUD pour gérer les types de bourses.

### Structure d'un Onglet

Chaque onglet présentera une interface cohérente :

1.  **Un tableau de données** listant les entrées existantes avec leurs informations principales.
2.  **Un bouton "Ajouter"** proéminent pour créer une nouvelle entrée (via une fenêtre modale ou un formulaire dédié).
3.  **Des actions "Modifier" et "Supprimer"** disponibles for chaque ligne du tableau.

## Avantages de cette approche

- **Centralisation :** L'administrateur sait exactement où aller pour configurer les données relatives aux membres.
- **Clarté et Simplicité :** L'interface n'est pas surchargée. Chaque onglet présente une tâche claire et unique, évitant la confusion.
- **Efficacité :** Le passage d'une gestion à l'autre est instantané (un simple clic sur un onglet).
- **Évolutivité (Scalability) :** Si de nouvelles entités de gestion sont nécessaires à l'avenir, il suffira d'ajouter de nouveaux onglets sans perturber l'architecture existante.

Cette interface de paramétrage alimentera ensuite les formulaires de création/modification des membres, où les administrateurs pourront sélectionner les clubs, commissions, etc., à partir de listes déroulantes peuplées par les données gérées ici.

---

# Spécifications Techniques de l'API

## Gestion des Clubs

**Contrôleur :** `ClubController.java`
**URL de base :** `/clubs`

### 1. Ajouter un club

- **Méthode :** `POST`
- **URL :** `/clubs`
- **Description :** Crée un nouveau club.
- **Données attendues (Body) :** Un objet `ClubDto`.
  ```json
  {
    "name": "Club des développeurs",
    "description": "Un club pour les passionnés de code."
  }
  ```
- **Données retournées (sur succès) :** L'objet `ClubDto` créé, incluant son ID.
  ```json
  {
    "status": "success",
    "message": null,
    "data": {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "name": "Club des développeurs",
      "description": "Un club pour les passionnés de code."
    }
  }
  ```
- **Code de succès :** `201 CREATED`

### 2. Obtenir tous les clubs

- **Méthode :** `GET`
- **URL :** `/clubs/all`
- **Description :** Récupère la liste de tous les clubs.
- **Données attendues :** N/A
- **Données retournées (sur succès) :** Une liste d'objets `ClubDto`.
  ```json
  {
    "status": "success",
    "message": null,
    "data": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "Club des développeurs",
        "description": "Un club pour les passionnés de code."
      }
    ]
  }
  ```
- **Code de succès :** `200 OK`

### 3. Obtenir un club par son ID

- **Méthode :** `GET`
- **URL :** `/clubs?clubId={id}`
- **Description :** Récupère un club spécifique via son identifiant.
- **Paramètres (Query) :**
  - `clubId` (string, requis) : L'ID du club à récupérer.
- **Données retournées (sur succès) :** L'objet `ClubDto` correspondant.
- **Code de succès :** `200 OK`

### 4. Supprimer un club

- **Méthode :** `DELETE`
- **URL :** `/clubs?clubId={id}`
- **Description :** Supprime un club spécifique.
- **Paramètres (Query) :**
  - `clubId` (string, requis) : L'ID du club à supprimer.
- **Données retournées (sur succès) :** Message de confirmation.
- **Code de succès :** `204 NO CONTENT` (La réponse aura un corps vide, mais l'enveloppe `ResponseVO` est construite côté serveur).

---

## Gestion des Commissions

**Contrôleur :** `CommissionController.java`
**URL de base :** `/commissions`

### 1. Ajouter une commission

- **Méthode :** `POST`
- **URL :** `/commissions`
- **Description :** Crée une nouvelle commission.
- **Données attendues (Body) :** Un objet `CommissionDto`.
  ```json
  {
    "name": "Commission Sociale",
    "description": "Organise les événements sociaux."
  }
  ```
- **Données retournées (sur succès) :** L'objet `CommissionDto` créé avec son ID.
- **Code de succès :** `201 CREATED`

### 2. Obtenir toutes les commissions

- **Méthode :** `GET`
- **URL :** `/commissions/all`
- **Description :** Récupère la liste de toutes les commissions.
- **Données retournées (sur succès) :** Une liste d'objets `CommissionDto`.
- **Code de succès :** `200 OK`

### 3. Obtenir une commission par son ID

- **Méthode :** `GET`
- **URL :** `/commissions?commissionId={id}`
- **Description :** Récupère une commission spécifique.
- **Paramètres (Query) :**
  - `commissionId` (string, requis) : L'ID de la commission.
- **Données retournées (sur succès) :** L'objet `CommissionDto` correspondant.
- **Code de succès :** `200 OK`

### 4. Mettre à jour une commission

- **Méthode :** `PUT`
- **URL :** `/commissions`
- **Description :** Met à jour une commission existante. L'ID doit être inclus dans le corps de la requête.
- **Données attendues (Body) :** Un objet `CommissionDto` complet.
  ```json
  {
    "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
    "name": "Nouveau nom de la Commission Sociale",
    "description": "Nouvelle description."
  }
  ```
- **Données retournées (sur succès) :** L'objet `CommissionDto` mis à jour.
- **Code de succès :** `200 OK`

### 5. Supprimer une commission

- **Méthode :** `DELETE`
- **URL :** `/commissions?commissionId={id}`
- **Description :** Supprime une commission.
- **Paramètres (Query) :**
  - `commissionId` (string, requis) : L'ID de la commission à supprimer.
- **Code de succès :** `204 NO CONTENT`

---

## Gestion des Bourses

**Contrôleur :** `BourseController.java`
**URL de base :** `/bourses`

### 1. Ajouter une bourse

- **Méthode :** `POST`
- **URL :** `/bourses`
- **Description :** Crée un nouveau type de bourse.
- **Données attendues (Body) :** Un objet `BourseDTO`.
  ```json
  {
    "type": "Bourse d'excellence",
    "amount": 50000
  }
  ```
- **Données retournées (sur succès) :** L'objet `BourseDTO` créé.
- **Code de succès :** `201 CREATED`

### 2. Obtenir toutes les bourses

- **Méthode :** `GET`
- **URL :** `/bourses/all`
- **Description :** Récupère la liste de tous les types de bourse.
- **Données retournées (sur succès) :** Une liste d'objets `BourseDTO`.
- **Code de succès :** `200 OK`

### 3. Obtenir une bourse par son ID

- **Méthode :** `GET`
- **URL :** `/bourses?bourseId={id}`
- **Description :** Récupère une bourse spécifique.
- **Paramètres (Query) :**
  - `bourseId` (string, requis) : L'ID de la bourse.
- **Données retournées (sur succès) :** L'objet `BourseDTO` correspondant.
- **Code de succès :** `200 OK`

### 4. Mettre à jour une bourse

- **Méthode :** `PUT`
- **URL :** `/bourses`
- **Description :** Met à jour un type de bourse. L'ID est requis dans le corps.
- **Données attendues (Body) :** Un objet `BourseDTO` complet.
  ```json
  {
    "id": "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
    "type": "Nouveau type",
    "amount": 75000
  }
  ```
- **Données retournées (sur succès) :** L'objet `BourseDTO` mis à jour.
- **Code de succès :** `200 OK`

### 5. Supprimer une bourse

- **Méthode :** `DELETE`
- **URL :** `/bourses?bourseId={id}`
- **Description :** Supprime un type de bourse.
- **Paramètres (Query) :**
  - `bourseId` (string, requis) : L'ID de la bourse à supprimer.
- **Code de succès :** `204 NO CONTENT`

### 6. Obtenir le montant de contribution d'un membre

- **Méthode :** `GET`
- **URL :** `/bourses/member-Contribution-amount?numberPhone={phone}`
- **Description :** Calcule et retourne le montant total de contribution pour un membre via son numéro de téléphone.
- **Paramètres (Query) :**
  - `numberPhone` (string, requis) : Le numéro de téléphone du membre.
- **Données retournées (sur succès) :** Un nombre représentant le montant.
  ```json
  {
    "status": "success",
    "message": null,
    "data": 15000.0
  }
  ```
- **Code de succès :** `200 OK`

---

## Enveloppe de Réponse Standard (`ResponseVO`)

Toutes les réponses de l'API (sauf pour les réponses `204 NO CONTENT` ou en cas d'erreur non gérée) sont enveloppées dans une structure standard pour assurer la cohérence.

- **`status`** (string): `"success"` ou `"error"`.
- **`message`** (string | null): Un message descriptif, surtout en cas d'erreur.
- **`data`** (object | array | null): Le contenu de la réponse (la "charge utile").
