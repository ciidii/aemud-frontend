# Documentation des Endpoints du `UserController`

Ce document détaille les endpoints disponibles dans le `UserController` de l'application AEMUD API, y compris les méthodes HTTP, les chemins, les données d'entrée et les types de retour.

---

## 1. Créer un utilisateur

- **Endpoint:** `POST /users`
- **Description:** Crée un nouvel utilisateur associé à un membre existant. Un mot de passe temporaire est généré et un email est envoyé à l'utilisateur pour l'informer.
- **Corps de la requête (`UserRequestDto`):**
  ```json
  {
    "memberId": "UUID",
    "roles": ["ROLE_USER", "ROLE_ADMIN"]
  }
  ```
- **Réponse Succès:**
  - **Code:** `201 CREATED`
  - **Corps:** `ResponseEntity<ResponseVO<Void>>`
- **Réponse Erreur:**
  - **Code:** `400 BAD REQUEST` (si le `memberId` n'existe pas ou si l'email est déjà utilisé).

---

## 2. Obtenir un utilisateur par son nom d'utilisateur

- **Endpoint:** `GET /users/user-by-username`
- **Description:** Récupère les informations détaillées d'un utilisateur en se basant sur son nom d'utilisateur (qui est son email).
- **Paramètres de la requête:**
  - `username` (String, requis): Le nom d'utilisateur (email) de l'utilisateur à rechercher.
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<UserResponseDto>>`
    ```json
    {
        "success": true,
        "data": {
            "id": 1,
            "username": "user@example.com",
            "roles": ["ROLE_USER"],
            "locked": false,
            "forcePasswordChange": false,
            "memberId": "UUID"
        },
        "errors": null
    }
    ```
- **Réponse Erreur:**
  - **Code:** `404 NOT FOUND` (si l'utilisateur n'est pas trouvé).

---

## 3. Changer le mot de passe à la première connexion

- **Endpoint:** `POST /users/change-password-first-connection`
- **Description:** Permet à un utilisateur de changer son mot de passe temporaire lors de sa première connexion.
- **Corps de la requête (`ChangePasswordRequestDTO`):**
  ```json
  {
    "username": "user@example.com",
    "password": "newPassword",
    "confirmPassword": "newPassword"
  }
  ```
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<Void>>`
- **Réponse Erreur:**
  - **Code:** `400 BAD REQUEST` (si les mots de passe ne correspondent pas ou si l'utilisateur n'est pas trouvé).

---

## 4. Demander un changement de mot de passe (email oublié)

- **Endpoint:** `POST /users/forgotten-password-email`
- **Description:** Initie le processus de mot de passe oublié. Vérifie si un email existe et envoie un code de réinitialisation de mot de passe à cette adresse.
- **Corps de la requête (`EmailDTO`):**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<Boolean>>` (avec `data` à `true`)
- **Réponse Erreur:**
  - **Code:** `400 BAD REQUEST` (si l'email n'existe pas dans la base de données).

---

## 5. Vérifier la validité du token de réinitialisation

- **Endpoint:** `POST /users/check-valide-token`
- **Description:** Vérifie si un token de réinitialisation de mot de passe est valide et n'a pas expiré pour un email donné.
- **Corps de la requête (`TokeEmailDTO`):**
  ```json
  {
    "email": "user@example.com",
    "token": "123456"
  }
  ```
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `Boolean` (`true` si le token est valide, `false` sinon).

---

## 6. Changer le mot de passe (procédure "oublié")

- **Endpoint:** `POST /users/change-password-forgotten`
- **Description:** Change le mot de passe d'un utilisateur en utilisant un token de réinitialisation valide qui a été préalablement envoyé.
- **Corps de la requête (`ChangeForgottenPassword`):**
  ```json
  {
    "username": "user@example.com",
    "token": "123456",
    "password": "newPassword",
    "confirmPassword": "newPassword"
  }
  ```
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<Void>>`
- **Réponse Erreur:**
  - **Code:** `400 BAD REQUEST` (si le token est invalide, si les mots de passe ne correspondent pas, etc.).

---

## 7. Rechercher et lister les utilisateurs

- **Endpoint:** `GET /users`
- **Description:** Recherche et liste les utilisateurs avec des filtres et une pagination. Permet une recherche avancée sur plusieurs critères.
- **Paramètres de la requête:**
  - `page` (Integer, optionnel, défaut: 1): Numéro de la page pour la pagination.
  - `rpp` (Integer, optionnel, défaut: 10): Nombre de résultats par page.
  - `keyword` (String, optionnel): Mot-clé pour rechercher dans le nom d'utilisateur (email).
  - `roles` (List<String>, optionnel): Liste de noms de rôles pour filtrer les utilisateurs (ex: `["ROLE_ADMIN", "ROLE_USER"]`).
  - `locked` (Boolean, optionnel): Filtre sur le statut de verrouillage du compte (`true` ou `false`).
  - `forcePasswordChange` (Boolean, optionnel): Filtre sur l'obligation de changer le mot de passe (`true` ou `false`).
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponsePageableVO<UserResponseDto>>` (une liste paginée d'utilisateurs).

---

## 8. Obtenir le profil de l'utilisateur courant

- **Endpoint:** `GET /users/me`
- **Description:** Récupère les informations de l'utilisateur actuellement authentifié via le token de sécurité.
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<UserResponseDto>>`
- **Réponse Erreur:**
  - **Code:** `401 UNAUTHORIZED` (si aucun utilisateur n'est authentifié).

---

## 9. Mettre à jour les rôles d'un utilisateur

- **Endpoint:** `PATCH /users/{id}/roles`
- **Description:** Met à jour les rôles assignés à un utilisateur spécifique.
- **Variable de chemin:**
  - `id` (Long, requis): L'ID de l'utilisateur à modifier.
- **Corps de la requête (`UserRequestDto`):**
  ```json
  {
    "roles": ["ROLE_MEMBER", "ROLE_EDITOR"]
  }
  ```
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<Void>>`
- **Réponse Erreur:**
  - **Code:** `404 NOT FOUND` (si l'utilisateur ou un des rôles n'existe pas).

---

## 10. Verrouiller un utilisateur

- **Endpoint:** `PATCH /users/{id}/lock`
- **Description:** Verrouille le compte d'un utilisateur, l'empêchant de se connecter.
- **Variable de chemin:**
  - `id` (Long, requis): L'ID de l'utilisateur à verrouiller.
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<Void>>`
- **Réponse Erreur:**
  - **Code:** `404 NOT FOUND` (si l'utilisateur n'existe pas).

---

## 11. Déverrouiller un utilisateur

- **Endpoint:** `PATCH /users/{id}/unlock`
- **Description:** Déverrouille le compte d'un utilisateur, lui permettant de se connecter à nouveau.
- **Variable de chemin:**
  - `id` (Long, requis): L'ID de l'utilisateur à déverrouiller.
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<Void>>`
- **Réponse Erreur:**
  - **Code:** `404 NOT FOUND` (si l'utilisateur n'existe pas).

---

## 12. Forcer le changement de mot de passe

- **Endpoint:** `PATCH /users/{id}/force-password-change`
- **Description:** Active ou désactive l'indicateur qui force un utilisateur à changer son mot de passe à sa prochaine connexion.
- **Variable de chemin:**
  - `id` (Long, requis): L'ID de l'utilisateur.
- **Paramètres de la requête:**
  - `value` (boolean, requis): `true` pour activer la force, `false` pour la désactiver.
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<Void>>`
- **Réponse Erreur:**
  - **Code:** `404 NOT FOUND` (si l'utilisateur n'existe pas).

---

## 13. Changer le mot de passe avec l'ancien mot de passe

- **Endpoint:** `POST /users/change-password`
- **Description:** Permet à un utilisateur authentifié de changer son propre mot de passe en fournissant son mot de passe actuel.
- **Corps de la requête (`ChangePasswordWithOldDTO`):**
  ```json
  {
    "username": "user@example.com",
    "oldPassword": "currentPassword123",
    "password": "newStrongPassword456",
    "confirmPassword": "newStrongPassword456"
  }
  ```
- **Réponse Succès:**
  - **Code:** `200 OK`
  - **Corps:** `ResponseEntity<ResponseVO<Void>>`
- **Réponse Erreur:**
  - **Code:** `400 BAD REQUEST` (si l'ancien mot de passe est incorrect ou si les nouveaux mots de passe ne correspondent pas).
