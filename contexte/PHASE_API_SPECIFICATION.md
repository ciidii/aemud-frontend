# Spécification de l'API pour la gestion des Phases

Ce document décrit les points d'accès (endpoints) de l'API pour la gestion des phases d'un mandat. Il est destiné à l'équipe frontend.

**URL de base de l'API :** `/phases`

---

### Objet `PhaseDto`

Cet objet représente une phase. C'est le format standard retourné par la plupart des endpoints.

```json
{
  "id": "string",
  "nom": "string",
  "dateDebut": "YYYY-MM-DD",
  "dateFin": "YYYY-MM-DD",
  "dateDebutInscription": "YYYY-MM-DD",
  "dateFinInscription": "YYYY-MM-DD",
  "status": "string" // PASSED, CURRENT, ou FUTURE
}
```

---

## Endpoints

### 1. Créer une nouvelle phase

Crée une nouvelle phase et l'associe à une période de mandat existante.

- **Méthode :** `POST`
- **URL :** `/phases`
- **Description :** Attention, cette route est principalement destinée à des ajouts manuels simples. La création complexe de phases se fait via la route de mise à jour de `PeriodeMandat` (`PUT /periode-mandats/{id}`).
- **Corps de la requête (`CreatePhaseDto`) :**

  ```json
  {
    "nom": "Année 1: 2026-2027", // Requis
    "dateDebut": "2026-10-01",     // Requis
    "dateFin": "2027-01-31",       // Requis
    "periodeMandatId": "string",     // Requis, ID de la période de mandat parente
    "dateDebutInscription": "2026-10-01", // Optionnel, par défaut dateDebut
    "dateFinInscription": "2027-01-31"     // Optionnel, par défaut dateFin
  }
  ```

- **Réponse (Succès) :**
  - **Code :** `201 CREATED`
  - **Corps :** L'objet `PhaseDto` nouvellement créé, enveloppé dans `ResponseVO`.
    ```json
    {
      "status": "success",
      "message": null,
      "data": {
        // Objet PhaseDto
      }
    }
    ```

- **Réponses (Erreur) :**
  - **Code :** `400 BAD REQUEST` si les données de la requête sont invalides (champs manquants, dates incohérentes avec le mandat parent).
  - **Code :** `404 NOT FOUND` si le `periodeMandatId` fourni n'existe pas.

---

### 2. Obtenir toutes les phases

Récupère une liste de toutes les phases de tous les mandats.

- **Méthode :** `GET`
- **URL :** `/phases`
- **Réponse (Succès) :**
  - **Code :** `200 OK`
  - **Corps :** Une liste d'objets `PhaseDto`.
    ```json
    {
      "status": "success",
      "message": null,
      "data": [
        // ... liste d'objets PhaseDto
      ]
    }
    ```

---

### 3. Obtenir une phase par son ID

Récupère les détails d'une phase spécifique.

- **Méthode :** `GET`
- **URL :** `/phases/{id}`
- **Paramètre d'URL :**
  - `id` (string) : L'ID de la phase à récupérer.
- **Réponse (Succès) :**
  - **Code :** `200 OK`
  - **Corps :** L'objet `PhaseDto` correspondant.
- **Réponse (Erreur) :**
  - **Code :** `404 NOT FOUND` si aucune phase ne correspond à l'ID.

---

### 4. Obtenir toutes les phases d'une période de mandat

Récupère toutes les phases associées à une période de mandat spécifique.

- **Méthode :** `GET`
- **URL :** `/phases/periode-mandat/{periodeMandatId}`
- **Paramètre d'URL :**
  - `periodeMandatId` (string) : L'ID de la période de mandat.
- **Réponse (Succès) :**
  - **Code :** `200 OK`
  - **Corps :** Une liste d'objets `PhaseDto`.

---

### 5. Obtenir la phase active

Récupère la phase qui est actuellement en cours (basé sur la date du serveur).

- **Méthode :** `GET`
- **URL :** `/phases/active`
- **Réponse (Succès) :**
  - **Code :** `200 OK`
  - **Corps :** L'objet `PhaseDto` de la phase active.
- **Réponse (Erreur) :**
  - **Code :** `404 NOT FOUND` si aucune phase n'est actuellement active.

---

### 6. Mettre à jour une phase

Met à jour les informations d'une phase existante.

- **Méthode :** `PUT`
- **URL :** `/phases/{id}`
- **Paramètre d'URL :**
  - `id` (string) : L'ID de la phase à mettre à jour.
- **Corps de la requête (`UpdatePhaseDto`) :**

  ```json
  {
    "nom": "Nouveau nom de la phase", // Requis
    "dateDebut": "2026-10-05",        // Requis
    "dateFin": "2027-02-05",          // Requis
    "dateDebutInscription": "2026-10-05", // Optionnel
    "dateFinInscription": "2027-02-05"     // Optionnel
  }
  ```

- **Réponse (Succès) :**
  - **Code :** `200 OK`
  - **Corps :** L'objet `PhaseDto` mis à jour.
- **Réponses (Erreur) :**
  - **Code :** `400 BAD REQUEST` si les données sont invalides.
  - **Code :** `404 NOT FOUND` si l'ID de la phase n'existe pas.

---

### 7. Supprimer une phase

Supprime une phase.

- **Méthode :** `DELETE`
- **URL :** `/phases/{id}`
- **Paramètre d'URL :**
  - `id` (string) : L'ID de la phase à supprimer.
- **Réponse (Succès) :**
  - **Code :** `204 NO CONTENT`
  - **Corps :** Aucun.
- **Réponse (Erreur) :**
  - **Code :** `404 NOT FOUND` si l'ID de la phase n'existe pas.
