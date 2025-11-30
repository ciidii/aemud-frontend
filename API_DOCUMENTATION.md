# Documentation des Endpoints de l'API

Ce document détaille les endpoints de l'API pour les contrôleurs `MemberController` et `RegistrationController`, à destination de l'équipe frontend.

## Table des Matières

- [MemberController](#membercontroller)
  - [POST /members](#post-members)
  - [GET /members/{memberId}](#get-membersmemberid)
  - [GET /members/numberphone](#get-membersnumberphone)
  - [PUT /members](#put-members)
  - [DELETE /members](#delete-members)
  - [POST /members/search](#post-memberssearch)
- [RegistrationController](#registrationcontroller)
  - [GET /registration](#get-registration)
  - [POST /registration](#post-registration)
  - [POST /registration/number-phone](#post-registrationnumber-phone)
  - [PUT /registration/{id}](#put-registrationid)
  - [DELETE /registration/{id}](#delete-registrationid)
  - [GET /registration/member/{memberId}/history](#get-registrationmembermemberidhistory)

---

## MemberController

Préfixe du chemin : `/aemud/api/v1/members`

### POST /members

- **Description** : Ajoute un nouveau membre.
- **Méthode** : `POST`
- **Chemin** : `/members`
- **Corps de la requête** (`MemberRequestDto`):

```json
{
  "id": "string (optionnel, pour mise à jour)",
  "personalInfo": {
    "name": "string",
    "firstname": "string",
    "nationality": "string",
    "gender": "string",
    "birthday": "date (YYYY-MM-DD)",
    "maritalStatus": "string (SINGLE, MARRIED, DIVORCED, WIDOWED)"
  },
  "membershipInfo": {
    "legacyInstitution": "string",
    "bacSeries": "string",
    "bacMention": "string",
    "yearOfBac": "string",
    "aemudCourses": "string",
    "otherCourses": "string",
    "participatedActivity": "string",
    "politicOrganisation": "string"
  },
  "academicInfo": {
    "institutionName": "string",
    "studiesDomain": "string",
    "studiesLevel": "string"
  },
  "addressInfo": {
    "addressInDakar": "string",
    "holidayAddress": "string",
    "addressToCampus": "string"
  },
  "contactInfo": {
    "numberPhone": "string",
    "email": "string",
    "personToCalls": [
      {
        "lastname": "string",
        "firstname": "string",
        "requiredNumberPhone": "string",
        "optionalNumberPhone": "string",
        "relationship": "string"
      }
    ]
  },
  "bourse": "string (ID de la bourse)",
  "clubs": ["string (ID du club)"],
  "commissions": ["string (ID de la commission)"],
  "religiousKnowledge": {
    "arabicProficiency": "string (BEGINNER, INTERMEDIATE, ADVANCED, FLUENT)",
    "coranLevel": "string (LEVEL_1, LEVEL_2, ...)",
    "aqida": [
      {
        "acquired": "boolean",
        "bookName": "string",
        "teacherName": "string",
        "learningPlace": "string"
      }
    ],
    "fiqhs": [
      {
        "acquired": "boolean",
        "bookName": "string",
        "teacherName": "string",
        "learningPlace": "string"
      }
    ]
  }
}
```

- **Réponse** (`ResponseVO<MemberDataResponseDTO>`): Un objet contenant les données du membre créé. Voir la structure de `MemberDataResponseDTO` dans la section `GET /members/{memberId}`.

---

### GET /members/{memberId}

- **Description** : Récupère un membre par son identifiant unique.
- **Méthode** : `GET`
- **Chemin** : `/members/{memberId}`
- **Variable de chemin** :
  - `memberId` (string) : L'identifiant du membre.
- **Réponse** (`ResponseVO<MemberDataResponseDTO>`):

```json
{
  "data": {
    "id": "string",
    "personalInfo": { ... },
    "membershipInfo": { ... },
    "academicInfo": { ... },
    "addressInfo": { ... },
    "contactInfo": { ... },
    "bourse": {
      "id": "string",
      "name": "string",
      "montant": "double",
      "members": ["string (IDs)"]
    },
    "clubs": [
      {
        "id": "string",
        "name": "string",
        "members": ["string (IDs)"]
      }
    ],
    "commissions": [
      {
        "id": "string",
        "name": "string",
        "members": ["string (IDs)"]
      }
    ],
    "registrations": [
      {
        "id": "string",
        "member": "string (ID du membre)",
        "mandatName": "string",
        "phase": { /* Objet PhaseDto */ },
        "dateInscription": "date (YYYY-MM-DD)",
        "registrationType": "string (NEW, RENEWAL)",
        "statusPayment": "boolean",
        "registrationStatus": "string (PENDING, VALIDATED, REJECTED)"
      }
    ],
    "religiousKnowledge": { ... },
    "status": "string (ACTIVE, INACTIVE, ...)"
  },
  "message": "string",
  "httpStatus": "string",
  "success": "boolean"
}
```

---

### GET /members/numberphone

- **Description** : Recherche un membre par son numéro de téléphone.
- **Méthode** : `GET`
- **Chemin** : `/members/numberphone`
- **Paramètre de requête** :
  - `numberphone` (string) : Le numéro de téléphone à rechercher.
- **Réponse** : Identique à `GET /members/{memberId}`.

---

### PUT /members

- **Description** : Met à jour un membre existant.
- **Méthode** : `PUT`
- **Chemin** : `/members`
- **Corps de la requête** (`MemberRequestDto`) : Identique à `POST /members`. L'`id` dans le corps est utilisé pour identifier le membre à mettre à jour.
- **Réponse** : Identique à `POST /members`.

---

### DELETE /members

- **Description** : Supprime un membre.
- **Méthode** : `DELETE`
- **Chemin** : `/members`
- **Paramètre de requête** :
  - `memberId` (string) : L'identifiant du membre à supprimer.
- **Réponse** (`ResponseVO<Void>`):

```json
{
  "message": "string",
  "httpStatus": "string",
  "success": "boolean"
}
```

---

### POST /members/search

- **Description** : Recherche des membres avec des filtres, pagination et tri.
- **Méthode** : `POST`
- **Chemin** : `/members/search`
- **Corps de la requête** (`MemberSearchRequest`):

```json
{
  "page": "integer (défaut: 1)",
  "rpp": "integer (défaut: 10)",
  "keyword": "string (recherche sur nom, prénom, email, téléphone)",
  "club": ["string (IDs de club)"],
  "commission": ["string (IDs de commission)"],
  "paymentStatus": "string",
  "bourse": ["string (IDs de bourse)"],
  "registrationStatus": "string (PENDING, VALIDATED, REJECTED)",
  "mandatIds": ["string (IDs de mandat)"],
  "phaseIds": ["string (IDs de phase)"],
  "registrationType": "string (NEW, RENEWAL)",
  "sortColumn": "string (nom de la colonne pour le tri)",
  "sortDirection": "boolean (true pour ascendant, false pour descendant)"
}
```

- **Réponse** (`ResponsePageableVO<MemberDataResponseDTO>`):

```json
{
  "totalElements": "long",
  "items": [ /* Liste de MemberDataResponseDTO */ ],
  "pageable": {
    "page": "integer",
    "rpp": "integer"
  }
}
```

---
---

## RegistrationController

Préfixe du chemin : `/aemud/api/v1/registration`

### GET /registration

- **Description** : Récupère la liste des inscriptions pour une phase donnée, avec pagination.
- **Méthode** : `GET`
- **Chemin** : `/registration`
- **Paramètres de requête** :
  - `page` (integer, optionnel) : Numéro de la page.
  - `rpp` (integer, optionnel) : Nombre d'éléments par page.
  - `phaseId` (string) : L'identifiant de la phase.
- **Réponse** (`ResponsePageableVO<RegistrationRequestDto>`): Une liste paginée d'inscriptions.

---

### POST /registration

- **Description** : Crée une nouvelle inscription pour un membre.
- **Méthode** : `POST`
- **Chemin** : `/registration`
- **Corps de la requête** (`RegistrationRequestDto`):

```json
{
  "member": "string (ID du membre)",
  "phaseId": "string (ID de la phase)",
  "registrationType": "string (NEW, RENEWAL)",
  "statusPayment": "boolean"
}
```

- **Réponse** (`ResponseVO<Void>`).

---

### POST /registration/number-phone

- **Description** : Crée une nouvelle inscription pour un membre en utilisant son numéro de téléphone.
- **Méthode** : `POST`
- **Chemin** : `/registration/number-phone`
- **Corps de la requête** (`RegistrationRequestWithPhoneNumberDto`):

```json
{
  "id": "string (optionnel)",
  "memberPhoneNumber": "string",
  "phaseId": "string",
  "registrationType": "string (NEW, RENEWAL)",
  "statusPayment": "boolean",
  "registrationStatus": "string (PENDING, VALIDATED, REJECTED)"
}
```

- **Réponse** (`ResponseVO<Void>`).

---

### PUT /registration/{id}

- **Description** : Met à jour une inscription existante.
- **Méthode** : `PUT`
- **Chemin** : `/registration/{id}`
- **Variable de chemin** :
  - `id` (string) : L'identifiant de l'inscription.
- **Corps de la requête** (`RegistrationRequestDto`): Identique à `POST /registration`.
- **Réponse** (`ResponseVO<Void>`).

---

### DELETE /registration/{id}

- **Description** : Supprime une inscription.
- **Méthode** : `DELETE`
- **Chemin** : `/registration/{id}`
- **Variable de chemin** :
  - `id` (string) : L'identifiant de l'inscription à supprimer.
- **Réponse** (`ResponseVO<Void>`).

---

### GET /registration/member/{memberId}/history

- **Description** : Récupère l'historique des inscriptions (mandats et phases) pour un membre spécifique.
- **Méthode** : `GET`
- **Chemin** : `/registration/member/{memberId}/history`
- **Variable de chemin** :
  - `memberId` (string) : L'identifiant du membre.
- **Réponse** (`ResponseVO<List<MandatHistoryDTO>>`):

```json
{
  "data": [
    {
      "mandat": { /* Objet MandatDto */ },
      "phases": [
        {
          "phase": { /* Objet PhaseDto */ },
          "registration": { /* Objet RegistrationResponseDto ou null */ },
          "status": "string (COMPLETED, IN_PROGRESS, PENDING, NOT_APPLICABLE)",
          "isRegistrable": "boolean"
        }
      ]
    }
  ],
  "message": "string",
  "httpStatus": "string",
  "success": "boolean"
}
```
