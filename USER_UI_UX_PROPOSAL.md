### Philosophie de conception – Gestion des utilisateurs

1. **Guidage actif :** Les écrans de gestion des utilisateurs doivent guider l’admin et l’utilisateur final à chaque étape (labels clairs, textes d’aide, validations immédiates).
2. **Cohérence visuelle :** Réutiliser systématiquement le design system existant : couleurs (`$primary-500`, `$gray-x`, `$danger-500`, `$success-500`), typographie (`@mixin text-body-regular`, `@mixin text-heading-x`), espacements (`$space-x`), cartes (`.card`), boutons (`.btn-primary`, `.btn-secondary`).
3. **Feedback instantané :** Montrer directement l’impact des actions : états verrouillé/déverrouillé, obligation de changer le mot de passe, erreurs de validation, succès d’actions.
4. **Lisibilité des statuts :** Statuts de comptes (actif, verrouillé, doit changer son mot de passe, rôles) doivent être visibles au premier coup d’œil dans la liste et sur la fiche.

---

### Endpoints pris en charge

Les écrans décrits dans ce document couvrent les endpoints suivants du `UserController` :

1. `POST /users` – Créer un utilisateur (admin)
2. `GET /users/user-by-username` – Rechercher un utilisateur par username/email (admin ou interne)
3. `POST /users/change-password-first-connection` – Changer le mot de passe à la première connexion (utilisateur final)
4. `POST /users/forgotten-password-email` – Demande de réinitialisation du mot de passe (utilisateur final)
5. `POST /users/check-valide-token` – Vérifier le token de réinitialisation (utilisateur final)
6. `POST /users/change-password-forgotten` – Changer le mot de passe via la procédure "oublié" (utilisateur final)
7. `GET /users` – Rechercher et lister les utilisateurs (admin)
8. `GET /users/me` – Obtenir le profil de l’utilisateur courant (utilisateur final)
9. `PATCH /users/{id}/roles` – Mettre à jour les rôles (admin)
10. `PATCH /users/{id}/lock` – Verrouiller un utilisateur (admin)
11. `PATCH /users/{id}/unlock` – Déverrouiller un utilisateur (admin)
12. `PATCH /users/{id}/force-password-change` – Forcer le changement de mot de passe (admin)
13. `POST /users/change-password` – Changer le mot de passe avec l’ancien (utilisateur final)

---

### Architecture UX & navigation

#### 1. Rôles et accès

1. **Admin / Super-admin**
   - Accès au menu "Utilisateurs" dans la sidebar.
   - Accès aux écrans : Liste des utilisateurs, Création, Détail, Edition des rôles et des statuts.
2. **Utilisateur standard**
   - N’a pas accès à la gestion des utilisateurs.
   - Accède uniquement à : première connexion, mot de passe oublié, changement de mot de passe, profil "Mon compte".

#### 2. Arborescence de navigation (module `user`)

Sous `features/user` :

1. `''` → **Liste des utilisateurs** (`UserListComponent`) – Titre : "Utilisateurs".
2. `'add'` → **Création d’un utilisateur** (`UserAddComponent`) – Titre : "Créer un utilisateur".
3. `'details/:id'` → **Détail d’un utilisateur** (`UserDetailsComponent`) – Titre : "Détail utilisateur".
4. `'edit/:id'` (optionnel) → **Edition d’un utilisateur** (`UserEditComponent`) – Titre : "Modifier l’utilisateur".

La route principale vers le module user est ajoutée dans la configuration globale (ex : `/admin/users`). Seuls les admins voient l’entrée correspondante dans la sidebar.

---

### Écran 1 – Liste des utilisateurs (UserList)

#### Objectifs UX

1. Permettre aux admins de trouver rapidement un utilisateur.
2. Visualiser immédiatement les statuts clés : rôles, verrouillage, obligation de changer le mot de passe.
3. Offrir des actions rapides (verrouiller, déverrouiller, modifier rôles, voir détail).

#### Layout général

1. **Page container**
   - Utilisation d’un container similaire aux listes de membres/mandats : titre de page + carte principale.
   - Titre : `h1` "Utilisateurs" (typo gérée globalement par `styles.scss`).
2. **Barre d’actions supérieure**
   - À droite : bouton principal "Créer un utilisateur" (`.btn-primary`).
3. **Carte principale (contenu)**
   - Haut de la carte : zone de filtres.
   - Milieu : tableau paginé.
   - Bas : pagination et résumé du nombre de résultats.

#### Zone de filtres

1. **Champs de filtre** (alignés sur un ou deux grids Bootstrap) :
   - `keyword` – Champ texte pour rechercher par email (username).
   - `roles` – Multi-select des rôles disponibles.
   - `locked` – Sélecteur (Tous / Verrouillés / Non verrouillés).
   - `forcePasswordChange` – Sélecteur (Tous / Oui / Non).
2. **Actions de filtre**
   - Bouton "Filtrer" (`.btn-primary`).
   - Bouton "Réinitialiser" (`.btn-secondary` ou `.btn-outline-primary`).
3. **Feedback**
   - Affichage d’un petit texte "X utilisateurs trouvés" après application du filtre.

#### Tableau des utilisateurs

1. **Colonnes principales**
   - Email (username).
   - Rôles (affichés sous forme de badges).
   - Statut de verrouillage.
   - Statut "Doit changer le mot de passe".
   - Actions.
2. **Représentation des statuts**
   - **Verrouillé / Actif** :
     - Badge vert (basé sur `$success-500`) pour "Actif".
     - Badge rouge (basé sur `$danger-500`) pour "Verrouillé".
   - **Doit changer le mot de passe** :
     - Badge orange (basé sur `$warning-500`) pour "Doit changer son mot de passe".
     - Badge neutre / aucun badge si non requis.
3. **Rôles**
   - Chaque rôle affiché dans un badge (couleur principale `$primary-500` ou gris `$gray-600` selon la hiérarchie).
4. **Actions par ligne**
   - Icône / bouton "Voir détail".
   - Icône / bouton "Modifier rôles" (qui ouvre soit un modal, soit redirige vers l’édition).
   - Bouton "Verrouiller" ou "Déverrouiller" (état dépendant du backend).
   - Bouton "Forcer changement MDP" (toggle ou action unique).

#### States spécifiques

1. **Chargement**
   - Indicateur de chargement (spinner) centré dans la carte.
2. **Aucun résultat**
   - Message dans la carte : "Aucun utilisateur trouvé".
   - Lien ou bouton "Réinitialiser les filtres".
3. **Erreur backend**
   - Bandeau d’erreur en haut de la carte (couleurs basées sur `$danger-500`).

---

### Écran 2 – Création d’un utilisateur (UserAdd)

Endpoint principal : `POST /users`.

#### Objectifs UX

1. Créer un utilisateur à partir d’un membre existant de manière simple.
2. Réduire les erreurs en guidant l’admin sur les rôles et l’email.

#### Layout général

1. **Structure de page**
   - Titre : `h1` "Créer un utilisateur".
   - Contenu principal dans une carte centrale, similaire aux formulaires de création de mandat ou d’ajout de membre.

2. **Sections du formulaire**
   - Section 1 : "Membre associé".
   - Section 2 : "Rôles et accès".

#### Section "Membre associé"

1. **Sélection du membre**
   - Soit un champ de recherche (type autocomplete) pour sélectionner un membre existant.
   - Soit un select, en cohérence avec l’existant pour l’association `Member`.
2. **Infos résumées du membre**
   - Une fois sélectionné : affichage dans un encadré léger (nom, prénom, email, ID du membre).
3. **Erreurs possibles**
   - MemberId non trouvé (`400 BAD REQUEST`) → message d’erreur sous le champ.

#### Section "Rôles et accès"

1. **Sélection des rôles**
   - Liste de cases à cocher ou composant multi-select.
   - Minimum recommandé : `ROLE_USER` par défaut si cohérent avec la politique de sécurité.
2. **Texte d’aide**
   - Explication : "Un mot de passe temporaire sera généré et envoyé à l’adresse email associée au membre."

#### Actions & feedback

1. **Boutons**
   - Bouton principal : "Créer l’utilisateur".
   - Bouton secondaire : "Annuler" (retour à la liste).
2. **Succès**
   - Afficher un message de succès (bandeau ou toast) et rediriger vers la liste ou la fiche de l’utilisateur.
3. **Erreurs**
   - Email déjà utilisé / memberId invalide → messages d’erreur ciblés, pas de message technique.

---

### Écran 3 – Détail utilisateur (UserDetails)

Objectif : offrir une vue claire d’un utilisateur et regrouper les actions d’administration.

#### Structure générale

1. **Header de fiche**
   - Email (username) comme titre principal.
   - Badges pour :
     - Rôles principaux.
     - Statut de verrouillage.
     - Obligation de changer de mot de passe.
   - Boutons d’action en haut à droite : "Modifier", "Verrouiller / Déverrouiller", "Forcer changement MDP".

2. **Section "Informations générales"**
   - Champs en lecture seule : ID utilisateur, username (email), memberId, éventuellement date de création.

3. **Section "Rôles et permissions"**
   - Liste des rôles actuels.
   - Bouton "Modifier les rôles" ouvrant un panneau ou un modal :
     - Interface similaire à celle de la création.
     - Action backend : `PATCH /users/{id}/roles`.

4. **Section "Sécurité & accès"**
   - Bloc expliquant l’état du compte :
     - "Compte actif" ou "Compte verrouillé".
     - "L’utilisateur devra changer son mot de passe à sa prochaine connexion" (si `forcePasswordChange = true`).
   - Actions :
     - Verrouiller / déverrouiller (appel à `/users/{id}/lock` / `/users/{id}/unlock`).
     - Forcer / désactiver le changement de mot de passe (appel à `/users/{id}/force-password-change?value=true|false`).

5. **Messages & feedback**
   - Success : bandeaux verts.
   - Erreurs : bandeaux rouges, avec messages métiers clairs.

---

### Écran 4 – Edition utilisateur (UserEdit)

Cet écran est optionnel. Deux options :

1. Intégrer les capacités d’édition directement dans la page de détail (sections éditables inline ou via modals).
2. Utiliser une page séparée `UserEditComponent` qui reprend la structure de `UserAdd` mais en pré-rempli.

Recommandation :

- Commencer avec une édition via la page de détail (moins de navigation, plus rapide pour l’admin).
- Prévoir `UserEditComponent` uniquement si la logique devient trop complexe dans `UserDetails`.

---

### Parcours utilisateur final – Mot de passe & profil

Ces écrans se trouvent dans le module d’authentification / profil, mais ils s’appuient sur les endpoints du `UserController`.

#### 1. Première connexion (`POST /users/change-password-first-connection`)

1. **Contexte**
   - L’utilisateur reçoit un mot de passe temporaire par email.
   - Au premier login, il est redirigé vers un écran dédié de changement de mot de passe.
2. **Écran**
   - Formulaire centré en carte :
     - Username (email) pré-rempli si possible.
     - Champ "Nouveau mot de passe".
     - Champ "Confirmer le mot de passe".
   - Texte d’aide sur la sécurité du mot de passe.
3. **Feedback**
   - Erreur si les mots de passe ne correspondent pas.
   - Erreur si l’utilisateur n’est pas trouvé.
   - Succès : redirection vers le tableau de bord.

#### 2. Mot de passe oublié

Endpoints :

- `POST /users/forgotten-password-email`.
- `POST /users/check-valide-token`.
- `POST /users/change-password-forgotten`.

1. **Écran A – Demande de réinitialisation**
   - Un seul champ "Adresse email".
   - Message expliquant qu’un code sera envoyé si l’email existe.
   - Succès (même si l’email n’existe pas) : message neutre pour éviter les fuites d’information.

2. **Écran B – Saisie du code + nouveau mot de passe**
   - Champs : email, code/token, nouveau mot de passe, confirmation.
   - Option : vérifier le token en appelant `check-valide-token` avant l’envoi final.
   - En cas d’échec (`400 BAD REQUEST` ou token invalide) : message d’erreur clair.

3. **Écran C – Confirmation**
   - Message de succès et bouton "Se connecter".

#### 3. Changement de mot de passe connecté (`POST /users/change-password`)

1. **Écran**
   - Accessible depuis "Mon compte" ou depuis un menu utilisateur.
   - Champs : username (readonly ou caché), ancien mot de passe, nouveau mot de passe, confirmation.
2. **Feedback**
   - Erreur claire si l’ancien mot de passe est incorrect.
   - Message positif en cas de succès.

#### 4. Page "Mon profil" (`GET /users/me`)

1. **Contenu**
   - Carte avec : email, rôles, informations de base.
   - Indications générales sur la sécurité (ex : dernière mise à jour du mot de passe, si disponible plus tard).
2. **Actions**
   - Bouton "Changer mon mot de passe".

---

### Composants Angular à créer ou adapter

Dans `src/app/features/user/` :

1. `components/user-list/user-list.component.*` :
   - Liste paginée avec filtres, tableaux, actions de ligne.
2. `components/user-add/user-add.component.*` :
   - Formulaire de création d’utilisateur à partir d’un membre.
3. `components/user-details/user-details.component.*` :
   - Fiche utilisateur, regroupant information, rôles, sécurité.
4. `components/user-edit/user-edit.component.*` (optionnel) :
   - Formulaire d’édition si besoin.
5. `services/user.service.ts` :
   - Compléter avec les méthodes pour tous les endpoints listés.

Dans les modules `auth` / `shared` :

1. Écrans/méthodes pour :
   - Première connexion.
   - Mot de passe oublié.
   - Changement de mot de passe connecté.
   - Page "Mon profil".

---

### Lignes directrices de design

1. **Typographie**
   - Utiliser les mixins de `_typography.scss` :
     - Titres de page : `h1` → `text-heading-1`.
     - Sous-titres / sections : `h2/h3` → `text-heading-2/3`.
     - Texte courant : `text-body-regular`.
     - Labels : `text-label`.
2. **Couleurs**
   - Actions principales : `$primary-500` / `$primary-600`.
   - États de succès : `$success-500`.
   - États d’erreur : `$danger-500`.
   - Avertissements : `$warning-500`.
   - Fonds de cartes : `$color-background-panel`.
3. **Espacements & layout**
   - Utiliser `$space-3`, `$space-4`, `$space-6` pour les marges/paddings principaux.
   - Cartes avec `$radius-lg` et `$shadow-md` pour les blocs principaux.
4. **Formulaires**
   - S’appuyer sur `.form-control` Bootstrap + tokens personnalisés
   - Rappel : focus border color `$primary-400`, `box-shadow` basé sur `$primary-500` (déjà défini dans `styles.scss`).
5. **Messages d’erreur et feedback**
   - Utiliser `.invalid-feedback` pour les erreurs de champ.
   - Utiliser des bandeaux (alerts Bootstrap) configurés avec les tokens du design system pour les erreurs globales.

Ce document sert de référence produit et UX/UI pour toute la gestion des utilisateurs. Les prochains travaux consisteront à détailler l’implémentation de chaque écran dans Angular (HTML/TS/SCSS), en se basant sur ces principes et sur les composants existants (membres, mandats, layout global).