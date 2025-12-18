# Proposition UX/UI pour le Module de Gestion

## 1. Vision et Principes Directeurs

L'objectif est de créer une interface de **"Paramétrage"** permettant une gestion simple et centralisée des entités `Clubs`, `Commissions` et `Bourses`. Cette interface doit être intuitive, efficace et parfaitement intégrée au design existant de l'application.

Nos principes directeurs sont :
- **Cohérence** : Réutiliser les composants et les *tokens* du Design System pour une expérience unifiée.
- **Clarté** : Fournir des mises en page épurées où les actions sont clairement identifiables.
- **Efficacité** : Minimiser le nombre de clics et simplifier les parcours utilisateurs pour l'ajout, la modification et la suppression de données.

---

## 2. Maquette Fonctionnelle de l'Interface

L'interface sera structurée autour d'une page principale avec une navigation par onglets.

### 2.1. Structure Générale de la Page

La page se composera des éléments suivants :

- **Titre de la Page** : Un titre clair comme **"Paramétrage de l'application"**.
- **Zone de Navigation par Onglets** :
    - Des onglets clairement intitulés : "Clubs", "Commissions", "Bourses".
    - L'onglet actif sera visuellement distinct pour indiquer la section courante.
- **Contenu de l'Onglet Actif** : La zone principale où le contenu de l'onglet sélectionné est affiché.

```
+---------------------------------------------------------+
|                                                         |
|  Paramétrage de l'application                           |
|  ----------------------------                           |
|                                                         |
|  /-----------\  /------------\  /----------\            |
|  |  Clubs  |  | Commissions|  | Bourses  |            |
|  \-----------/  ----------------------------            |
|                                                         |
|  +---------------------------------------------------+  |
|  |                                                   |  |
|  |    CONTENU DE L'ONGLET "CLUBS"                    |  |
|  |                                                   |  |
|  +---------------------------------------------------+  |
|                                                         |
+---------------------------------------------------------+
```

### 2.2. Contenu d'un Onglet : Le Tableau de Données

Chaque onglet affichera une interface CRUD cohérente, composée d'une carte (`.card`) contenant :

1.  **En-tête de la Carte (`.card-header`)** :
    - À gauche : Le titre de la liste (ex: "Liste des clubs").
    - À droite : Un bouton d'action principal **"+ Ajouter un club"**.

2.  **Corps de la Carte (`.card-body`)** :
    - **Tableau de Données (`.table`)** :
        - Colonnes : Les colonnes doivent afficher les informations pertinentes (ex: `Nom`, `Description` pour un club ; `Type`, `Montant` pour une bourse).
        - **Colonne Actions** : Une colonne dédiée aux actions avec des icônes pour "Modifier" (`bi-pencil-fill`) et "Supprimer" (`bi-trash-fill`).
    - **État Vide (Empty State)** : Si le tableau ne contient aucune donnée, un message clair et centré s'affichera (ex: "Aucun club n'a été ajouté pour le moment.") avec un appel à l'action pour en créer un.

### 2.3. La Modale d'Ajout/Modification

Pour éviter de surcharger l'interface, les formulaires de création et de modification s'ouvriront dans une **fenêtre modale (`.modal`)**.

- **Titre de la Modale** : Dynamique (ex: "Ajouter un nouveau club" ou "Modifier le club : [Nom du club]").
- **Formulaire** :
    - Des champs de formulaire clairs (`.form-control`, `.form-floating`).
    - Les libellés (`.form-label`) indiqueront clairement l'information attendue.
    - Utilisation de l'astérisque (`.required-asterisk`) pour les champs obligatoires.
- **Pied de la Modale (`.modal-footer`)** :
    - Un bouton **"Enregistrer"** (`.btn-primary`) pour soumettre le formulaire.
    - Un bouton **"Annuler"** (`.btn-secondary` ou `.btn-outline-secondary`) pour fermer la modale.

### 2.4. La Modale de Confirmation de Suppression

La suppression étant une action destructive, elle doit être confirmée via une modale dédiée.

- **Titre** : "Confirmer la suppression".
- **Message** : Un texte explicite (ex: "Êtes-vous sûr de vouloir supprimer ce club ? Cette action est irréversible.").
- **Boutons** :
    - Un bouton **"Supprimer"** en rouge pour confirmer (`.btn-danger`).
    - Un bouton **"Annuler"** pour fermer la modale.

---

## 3. Intégration avec le Design System

Pour garantir la cohérence, voici comment les *tokens* de votre Design System seront appliqués.

| Élément UI                  | Token SCSS Recommandé                                        | Description                                                      |
| --------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Typographie**             |                                                              |                                                                  |
| Titre de la page            | `@include text-heading-2;`                                   | `Paramétrage de l'application`                                   |
| Titre dans le `card-header` | `@include text-heading-5;`                                   | `Liste des clubs`                                                |
| Texte du tableau            | `@include text-body-regular;`                                | Contenu des cellules                                             |
| Libellés de formulaire      | `@include text-label;` ou `.form-label`                      | Nom, Description, etc.                                           |
| **Couleurs**                |                                                              |                                                                  |
| Bouton "Ajouter"            | `background-color: $primary-500;`                            | Le bouton d'action principal                                     |
| Bouton "Enregistrer" (modale) | `background-color: $primary-500;`                            | Identique au bouton "Ajouter"                                    |
| Bouton "Supprimer"          | `background-color: $danger-500;`                             | Action destructive                                               |
| Bouton "Annuler"            | `background-color: $gray-600;` ou `border-color: $gray-600;` | Action secondaire, moins proéminente                           |
| Icône "Modifier"            | `color: $primary-600;`                                       | Action d'édition, non destructive                                |
| Icône "Supprimer"           | `color: $danger-500;`                                        | Clairement associée au danger                                    |
| Bordure de carte            | `border: 1px solid $color-border-default;`                   | Cohérent avec les autres cartes de l'application                 |
| Fond de l'en-tête de carte  | `background-color: $gray-100;`                               | Style standard pour les `.card-header`                           |
| **Espacements & Ombres**    |                                                              |                                                                  |
| Conteneur principal         | `padding: $space-8;`                                         | Aération de la page                                              |
| Marge entre les boutons     | `gap: $space-2;`                                             | Espacement dans le `modal-footer` ou la colonne d'actions        |
| Ombre des cartes            | `box-shadow: $shadow-md;`                                    | Ombre standard, avec `$shadow-lg` au survol (`:hover`)           |
| **Bordures**                |                                                              |                                                                  |
| Rayon des cartes et modales | `border-radius: $radius-lg;`                                 | Bords arrondis pour un look moderne et doux                      |
| Rayon des boutons           | `border-radius: $radius-md;`                                 | Bords de boutons cohérents                                       |

---

## 4. Conclusion

Cette approche structurée, basée sur des composants éprouvés (tableaux, modales) et rigoureusement alignée sur votre Design System, garantira une expérience utilisateur de haute qualité. Les administrateurs bénéficieront d'une interface claire, prévisible et agréable à utiliser pour gérer les données essentielles de l'application.
