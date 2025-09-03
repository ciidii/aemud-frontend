# Guide pour le Design System

Ce document contient les recommandations et les principes pour faire évoluer les variables SCSS (`_variables.scss`) vers un Design System complet, robuste et maintenable.

## 1. Palette de Couleurs Étendue

L'objectif est de passer d'une couleur unique par sémantique à une palette de nuances complète, offrant plus de flexibilité et de cohérence.

-   **Action :** Pour chaque couleur clé (`$primary`, `$secondary`, `$success`, etc.), générer une palette de 5 à 9 nuances.
-   **Nommage :** Utiliser une échelle numérique, par exemple : `$primary-100`, `$primary-300`, `$primary-500` (la couleur de base), `$primary-700`, `$primary-900`.
-   **Pourquoi :** Permet d'utiliser des variations de la même couleur pour les fonds, les textes, les bordures et les états interactifs (survol, focus, désactivé) tout en conservant une harmonie visuelle.

## 2. Styles de Texte Complets (Typographie)

Au-delà des tailles de police, un système typographique robuste définit des styles de texte complets.

-   **Action :** Combiner la taille (`font-size`), la graisse (`font-weight`) et la hauteur de ligne (`line-height`) pour créer des styles sémantiques.
-   **Exemples de styles à définir :**
    -   `text-heading-1`: Style pour les titres principaux.
    -   `text-body-large-bold`: Style pour un corps de texte mis en emphase.
    -   `text-body-regular`: Style pour le texte de lecture standard.
    -   `text-button`: Style pour le texte à l'intérieur des boutons.
-   **Implémentation :** Créer des "mixins" SCSS pour appliquer ces styles de manière cohérente dans toute l'application.
-   **Pourquoi :** Garantit que tous les éléments textuels de même nature sont visuellement identiques, renforçant la cohérence.

## 3. Organisation Sémantique des "Design Tokens"

Un nommage clair est la clé d'un système facile à utiliser et à maintenir.

-   **Action :** Renommer les variables de manière plus descriptive et basée sur leur usage plutôt que sur leur valeur.
-   **Exemples de renommage :**
    -   `$color-text-primary`: Pour le texte principal (ex: `#1A1A1A`).
    -   `$color-text-secondary`: Pour le texte d'importance moindre (ex: `#4D4D4D`).
    -   `$color-text-on-primary`: Pour le texte sur un fond de couleur primaire (souvent blanc).
    -   `$color-background-body`: La couleur de fond générale de l'application.
    -   `$color-background-panel`: La couleur de fond pour les conteneurs/panneaux.
    -   `$color-border-default`: La couleur de bordure la plus courante.
-   **Pourquoi :** Rend le système auto-documenté. Un développeur peut comprendre l'utilité d'une variable simplement en lisant son nom.

## 4. Variables de Composants

Pour assurer la cohérence des éléments d'interface les plus courants.

-   **Action :** Créer une section de variables dédiée aux composants réutilisables.
-   **Exemples de variables à ajouter :**
    -   `$button-padding-y`, `$button-padding-x`
    -   `$button-border-radius`, `$button-font-size`
    -   `$form-input-background`, `$form-input-border-color`, `$form-input-padding-y`
-   **Pourquoi :** Permet de modifier l'apparence de tous les boutons ou de tous les champs de formulaire de l'application en ne changeant que quelques lignes de code, garantissant une uniformité parfaite.
