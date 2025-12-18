# Plan d'Implémentation : Migration API Frontend (Angular)

Ce document détaille les étapes à suivre pour adapter l'application frontend Angular aux changements majeurs de l'API AEMUD, en se basant sur le "Guide de Migration API pour l'Équipe Frontend".

---

## **Phase 1 : Mise en Place du Nouveau Flux d'Authentification (Cookie-Based)**

*Cette phase est critique et doit être testée rigoureusement.*

### **Étape 1.1 : Refactor `AuthHttpService` (Login)**

*   **Fichier(s) concerné(s) :** `src/app/features/auth/services/auth-http.service.ts`
*   **Action :**
    *   Dans la méthode `login()`, supprimer toute la logique de récupération du token (`jwt`) depuis le corps de la réponse de l'endpoint `POST /auth/authenticate`.
    *   Supprimer toute instruction de stockage du token dans `localStorage` ou `sessionStorage`.
    *   La méthode `login()` doit toujours gérer le succès/échec de la requête, mais sans manipuler le JWT directement.
*   **Vérification :** Le navigateur doit envoyer un cookie `aemud-jwt` après un login réussi (vérifiable via les outils de développement).

### **Étape 1.2 : Nettoyer l'Intercepteur HTTP (`AuthInterceptor`)**

*   **Fichier(s) concerné(s) :** `src/app/core/interceptors/auth.interceptor.ts`
*   **Action :**
    *   Localiser et supprimer toute la logique qui récupère un token depuis le stockage local.
    *   Supprimer la ligne de code qui ajoute l'en-tête `Authorization: Bearer <token>` aux requêtes sortantes.
*   **Vérification :** Aucune requête API ne doit contenir l'en-tête `Authorization` pour les endpoints authentifiés.

### **Étape 1.3 : Refactor `AuthHttpService` (Logout)**

*   **Fichier(s) concerné(s) :** `src/app/features/auth/services/auth-http.service.ts`
*   **Action :**
    *   Créer une nouvelle méthode `logout()` dans `AuthHttpService`.
    *   Cette méthode doit effectuer une requête `POST` vers le nouvel endpoint `/auth/logout`.
    *   Après le succès de cette requête, effacer toute information utilisateur côté client (ex: dans `SessionService` ou `AppStateService`).
    *   Rediriger l'utilisateur vers la page de login (`/auth/login`).
    *   Mettre à jour tous les appels de déconnexion existants dans l'application (ex: dans les composants d'en-tête) pour utiliser cette nouvelle méthode `authService.logout()`.
*   **Vérification :** La déconnexion doit effacer le cookie d'authentification et rediriger l'utilisateur.

---

## **Phase 2 : Refonte de la Gestion des Erreurs**

*Cette phase améliore l'expérience utilisateur et la robustesse des formulaires.*

### **Étape 2.1 : Mettre à Jour les Modèles de Réponse**

*   **Fichier(s) concerné(s) :** `src/app/core/models/response-entity-api.ts` (ou tout modèle de réponse d'API global)
*   **Action :**
    *   S'assurer que l'interface ou la classe TypeScript correspondant aux réponses d'erreur API inclut désormais la propriété `errors: { field: string; message: string; }[]`.
    *   Exemple :
        ```typescript
        interface ErrorDetail {
          field: string;
          message: string;
        }

        interface ApiResponse<T> {
          success: boolean;
          message: string;
          data: T | null;
          errors?: ErrorDetail[];
        }
        ```

### **Étape 2.2 : Adapter l'Intercepteur d'Erreurs (`HttpErrorInterceptor` ou similaire)**

*   **Fichier(s) concerné(s) :** `src/app/shared/interceptors/http-error.ts` (ou `src/app/core/interceptors/error.interceptor.ts`)
*   **Action :**
    *   Modifier l'intercepteur pour capturer les réponses d'erreur (codes `4xx`).
    *   Extraire la liste `errors` du corps de la réponse d'erreur.
    *   Transformer cette liste en un format facile à utiliser par les composants de formulaire, par exemple un `Map<string, string>` ou un objet `{ [field: string]: string }`.
    *   Pour les erreurs sans `field` spécifique ou pour les erreurs `5xx`, utiliser le `message` global de la réponse d'erreur et le `NotificationService` pour afficher un toast d'erreur général.

### **Étape 2.3 : Améliorer les Composants de Formulaire**

*   **Fichier(s) concerné(s) :** Tous les composants contenant des formulaires qui interagissent avec l'API (ex: `LoginComponent`, `PasswordForgottenComponent`, `SignupComponent`).
*   **Action :**
    *   Dans la méthode `subscribe({ error: ... })` du composant, récupérer les erreurs structurées fournies par l'intercepteur.
    *   Créer une propriété dans le composant (ex: `formErrors: { [key: string]: string } = {};`) pour stocker les messages d'erreur spécifiques aux champs.
    *   Associer ces messages d'erreur aux `FormControl` correspondants pour les afficher directement sous les champs du formulaire.
    *   Mettre à jour le HTML des formulaires pour afficher dynamiquement ces messages d'erreur au bon endroit.

---

## **Phase 3 : Standardisation des Modèles de Données (UUID)**

*Cette phase est une tâche de type "find & replace" mais essentielle pour la cohérence.*

### **Étape 3.1 : Mettre à Jour les Modèles d'Utilisateurs**

*   **Fichier(s) concerné(s) :** `src/app/core/models/user.model.ts`
*   **Action :**
    *   Changer le type de la propriété `id` de `number` à `string` (UUID).

### **Étape 3.2 : Vérifier les Modèles Associés**

*   **Fichier(s) concerné(s) :** Rechercher tous les fichiers (`*.ts`) qui pourraient contenir des propriétés `id` ou `userId` ou `roleId` liées aux entités `User` ou `Role` (ex: `session.model.ts`, `member-data.model.ts`).
*   **Action :** Pour chaque propriété identifiée, s'assurer que son type est `string`.

### **Étape 3.3 : Validation des Services**

*   **Fichier(s) concerné(s) :** Tous les services (ex: `UserService`) qui construisent des URLs ou manipulent des IDs d'utilisateurs/rôles.
*   **Action :** Après les changements de typage, vérifier que le projet compile sans erreur. Le compilateur TypeScript devrait signaler toute incompatibilité.
*   **Vérification :** S'assurer que les URLs (ex: `/users/${userId}`) sont correctement construites avec des chaînes de caractères.
