# Documentation de l'API - Module de Notification SMS

Ce document fournit toutes les informations nécessaires à l'équipe frontend pour interagir avec l'API du module de notification SMS.

## 1. Principes Généraux

### Authentification

Toutes les requêtes, sauf indication contraire, doivent inclure un token JWT valide dans l'en-tête `Authorization`.

```http
Authorization: Bearer <votre_token_jwt>
```

### Format des Erreurs

Les erreurs de l'API (statuts `4xx` ou `5xx`) retournent une réponse JSON standardisée :

```json
{
  "timestamp": "2026-01-10T12:00:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Le nom de la campagne ne peut pas être vide",
  "path": "/api/sms-campaigns"
}
```

---

## 2. Gestion des Campagnes SMS (`SmsCampaignController`)

Ces endpoints permettent de créer et gérer l'envoi de campagnes SMS.

### 2.1. Créer une Campagne SMS

Crée une nouvelle campagne SMS et la met en file d'attente pour un envoi asynchrone.

-   **Endpoint** : `POST /sms-campaigns`
-   **Autorisation** : `ADMIN` ou `SUPER_ADMIN`

#### Requête

Le corps de la requête doit contenir le nom de la campagne, un groupe de destinataires, et **soit** un ID de modèle de message, **soit** un message personnalisé.

```json
// Fichier: CampaignRequestDto.java
{
  "campaignName": "String (requis)",
  "recipientGroupId": "String (requis)",

  // Fournir l'un des deux, mais pas les deux
  "messageTemplateId": "String (optionnel)",
  "customMessage": "String (optionnel)"
}
```

**Exemple 1 : Utilisation d'un modèle de message**

```json
{
  "campaignName": "Campagne de bienvenue Janvier",
  "recipientGroupId": "e2a9c372-52ce-4e32-a390-1c39a0ef6e39", // ID du groupe "Tous les membres"
  "messageTemplateId": "f1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6"
}
```

**Exemple 2 : Utilisation d'un message personnalisé**

```json
{
  "campaignName": "Maintenance Urgente",
  "recipientGroupId": "e2a9c372-52ce-4e32-a390-1c39a0ef6e39",
  "customMessage": "Bonjour {name}, une maintenance de nos services est prévue ce soir à 23h. Merci."
}
```
*Note : Les placeholders comme `{name}` et `{firstname}` sont automatiquement remplacés par le backend.*

#### Réponse

-   **Code `202 Accepted`** : La campagne a été acceptée et sera traitée. Le corps de la réponse contient les détails de la campagne créée.
-   **Code `400 Bad Request`** : Si des champs sont manquants, ou si `messageTemplateId` et `customMessage` sont fournis tous les deux (ou aucun des deux).

**Exemple de Réponse `202 Accepted`**

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
    "campaignName": "Maintenance Urgente",
    "smsModelId": null, // ou l'ID du modèle si utilisé
    "recipientGroupId": "e2a9c372-52ce-4e32-a390-1c39a0ef6e39",
    "status": "PENDING",
    "startedAt": "2026-01-10T12:01:00.000+00:00",
    "completedAt": null,
    "totalMessages": 0,
    "successfulMessages": 0,
    "failedMessages": 0
  },
  "message": "SUCCESS"
}
```

### 2.2. Obtenir les Messages en Échec d'une Campagne

Récupère la liste de tous les messages qui n'ont pas pu être envoyés ou livrés pour une campagne spécifique.

-   **Endpoint** : `GET /notifications/campaigns/{campaignId}/failures`
-   **Autorisation** : `ADMIN` ou `SUPER_ADMIN`

#### Paramètres

-   `campaignId` (String, requis) : L'ID de la campagne.

#### Réponse

-   **Code `200 OK`** : Retourne une liste d'objets `SmsLogDto`.

**Exemple de Réponse `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": "log-id-123",
      "campaignId": "a1b2c3d4-...",
      "recipientAddress": "+221771234567",
      "messageContent": "Bonjour...",
      "status": "DELIVERY_FAILED",
      "providerMessageId": "orange-msg-id-xyz",
      "sentAt": "2026-01-10T12:02:00.000+00:00",
      "lastStatusUpdateAt": "2026-01-10T12:03:00.000+00:00",
      "providerError": "Absent subscriber"
    }
  ],
  "message": "SUCCESS"
}
```

### 2.3. Relancer les Messages en Échec

Crée une nouvelle campagne "retry" qui cible uniquement les destinataires des messages en échec de la campagne originale.

-   **Endpoint** : `POST /notifications/campaigns/{campaignId}/retry`
-   **Autorisation** : `ADMIN` ou `SUPER_ADMIN`

#### Paramètres

-   `campaignId` (String, requis) : L'ID de la campagne originale contenant les échecs.

#### Réponse

-   **Code `202 Accepted`** : La campagne de relance a été créée. Le corps de la réponse est une `SmsCampaignDto` (similaire à la création de campagne).

---

## 3. Gestion des Groupes de Destinataires (`RecipientGroupController`)

Ces endpoints permettent de lister les groupes de destinataires disponibles pour les campagnes. *Note : La création/suppression est réservée aux super-admins car chaque groupe doit correspondre à une logique codée en dur dans le backend.*

### 3.1. Obtenir Tous les Groupes de Destinataires

Récupère la liste de tous les groupes de destinataires configurés dans le système. C'est l'endpoint à utiliser pour peupler une liste déroulante dans l'interface de création de campagne.

-   **Endpoint** : `GET /recipient-groups`
-   **Autorisation** : `ADMIN` ou `SUPER_ADMIN`

#### Réponse `200 OK`

Retourne une liste d'objets `RecipientGroupDto`.

```json
{
  "success": true,
  "data": [
    {
      "id": "e2a9c372-52ce-4e32-a390-1c39a0ef6e39",
      "groupKey": "ALL_MEMBERS",
      "name": "Tous les Membres",
      "description": "Inclut chaque membre de la base de données."
    },
    {
      "id": "...",
      "groupKey": "NEW_MEMBERS_LAST_30_DAYS",
      "name": "Nouveaux Membres (30 derniers jours)",
      "description": "Cible les membres inscrits durant les 30 derniers jours."
    }
  ],
  "message": "SUCCESS"
}
```

### 3.2. Autres Endpoints (Usage Limité)

-   `GET /recipient-groups/{id}` : Récupère un groupe par son ID.
-   `POST /recipient-groups` : Crée un nouveau groupe (SUPER_ADMIN seulement).
-   `DELETE /recipient-groups/{id}` : Supprime un groupe (SUPER_ADMIN seulement).

---

## 4. Gestion des Modèles de Messages (`SmsModelController`)

Ces endpoints permettent de gérer des messages SMS réutilisables.

### 4.1. Obtenir Tous les Modèles de Messages

Récupère la liste de tous les modèles de messages disponibles.

-   **Endpoint** : `GET /smsmodel/all`
-   **Autorisation** : `ADMIN` ou `SUPER_ADMIN`

#### Réponse `200 OK`

Retourne une liste d'objets `SmsModelDTO`.

```json
{
  "success": true,
  "data": [
    {
      "id": "f1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
      "modelName": "Message de Bienvenue",
      "smsModel": "Bienvenue à l'AEMUD, {name} ! Nous sommes heureux de vous compter parmi nous."
    }
  ],
  "message": "SUCCESS"
}
```

### 4.2. Autres Endpoints

-   `POST /smsmodel` : Crée un nouveau modèle (`SmsModelDTO`).
-   `GET /smsmodel?id={id}` : Récupère un modèle par son ID.
-   `DELETE /smsmodel?id={id}` : Supprime un modèle par son ID.

---

## 5. Note sur l'Architecture des Endpoints

Pour des raisons historiques, les chemins des endpoints ne sont pas parfaitement uniformes (`/sms-campaigns`, `/notifications/campaigns/...`, `/smsmodel`). Une future amélioration consistera à les harmoniser sous un préfixe commun, par exemple `/api/v1/...`. Le frontend doit pour l'instant utiliser les chemins tels que documentés ci-dessus.
