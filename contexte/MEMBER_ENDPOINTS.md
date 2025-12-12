# Documentation de l'API Membres

Ce document décrit les points d'accès (endpoints) de l'API pour la gestion des membres.

## Endpoints

### 1. Ajouter un membre

- **Méthode HTTP :** `POST`
- **URL :** `/members`
- **Description :** Ajoute un nouveau membre.
- **Corps de la requête :** `MemberRequestDto`
- **Réponse :** `ResponseEntity<ResponseVO<MemberDataResponseDTO>>`

#### Exemple de corps de requête (`MemberRequestDto`)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890"
  // ... autres champs pertinents
}
```

---

### 2. Obtenir un membre par ID

- **Méthode HTTP :** `GET`
- **URL :** `/members`
- **Paramètre de requête :** `member-id` (String)
- **Description :** Récupère un membre en utilisant son identifiant unique.
- **Réponse :** `ResponseEntity<ResponseVO<MemberDataResponseDTO>>`

#### Exemple d'appel

```
GET /members?member-id=12345
```

---

### 3. Trouver un membre par numéro de téléphone

- **Méthode HTTP :** `GET`
- **URL :** `/members/numberphone`
- **Paramètre de requête :** `numberphone` (String)
- **Description :** Recherche un membre à partir de son numéro de téléphone.
- **Réponse :** `ResponseEntity<ResponseVO<MemberDataResponseDTO>>`

#### Exemple d'appel

```
GET /members/numberphone?numberphone=+1234567890
```

---

### 4. Mettre à jour un membre

- **Méthode HTTP :** `PUT`
- **URL :** `/members`
- **Description :** Met à jour les informations d'un membre existant.
- **Corps de la requête :** `MemberRequestDto`
- **Réponse :** `ResponseEntity<ResponseVO<MemberDataResponseDTO>>`

#### Exemple de corps de requête (`MemberRequestDto`)

```json
{
  "id": "12345",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe.new@example.com",
  "phoneNumber": "+1234567891"
  // ... autres champs à mettre à jour
}
```

---

### 5. Supprimer un membre

- **Méthode HTTP :** `DELETE`
- **URL :** `/members`
- **Paramètre de requête :** `memberId` (String)
- **Description :** Supprime un membre par son identifiant.
- **Réponse :** `ResponseEntity<ResponseVO<Void>>`

#### Exemple d'appel

```
DELETE /members?memberId=12345
```

---

### 6. Rechercher des membres

- **Méthode HTTP :** `POST`
- **URL :** `/members/search`
- **Description :** Permet une recherche avancée de membres avec des filtres, pagination et tri.
- **Corps de la requête :** `MemberSearchRequest`
- **Réponse :** `ResponseEntity<ResponsePageableVO<MemberDataResponseDTO>>`

#### Exemple de corps de requête (`MemberSearchRequest`)

```json
{
  "page": 0,
  "rpp": 10,
  "keyword": "John",
  "club": [
    "club-id-1",
    "club-id-2"
  ],
  "mandatIds": [
    "mandat-id-1"
  ],
  "phaseIds": [
    "phase-id-1"
  ],
  "commission": [
    "commission-id-1"
  ],
  "bourse": true,
  "paymentStatus": "PAID",
  "registrationStatus": "ACTIVE",
  "registrationType": "NEW",
  "sortColumn": "lastName",
  "sortDirection": true
}
```

## Objets de Données (DTOs)

### `MemberDataResponseDTO`

Cet objet est utilisé dans les réponses pour représenter les données d'un membre.

```json
{
  "id": "12345",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890"
  // ... autres champs
}
```

### `ResponseVO<T>`

Enveloppe de réponse standard pour les requêtes uniques.

```json
{
  "success": true,
  "data": {
    /* ... données de type T ... */
  },
  "message": "Opération réussie"
}
```

### `ResponsePageableVO<T>`

Enveloppe de réponse pour les requêtes paginées, comme la recherche.

```json
{
  "success": true,
  "data": {
    "content": [
      {
        /* ... données de type T ... */
      },
      {
        /* ... données de type T ... */
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10
  },
  "message": "Recherche réussie"
}
```
