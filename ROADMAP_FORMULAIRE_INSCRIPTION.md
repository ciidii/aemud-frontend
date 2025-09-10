# Feuille de Route : Création du Formulaire d'Inscription des Membres

Ce document détaille les étapes de développement pour la création du nouveau formulaire d'inscription des membres, basé sur une architecture de composants composables et réutilisables.

## Phase 0 : Initialisation et Architecture (Terminée)

-   [x] **Analyse UX/UI :** Définition d'une approche en plusieurs étapes (wizard) pour simplifier l'expérience utilisateur.
-   [x] **Choix d'Architecture :** Adoption d'une stratégie de "Composition de Formulaires Réactifs" avec un composant parent "intelligent" et des composants enfants "réutilisables".
-   [x] **Création de la Feuille de Route :** Rédaction de ce document pour suivre la progression.

## Phase 1 : Développement des Composants de Base (Terminée)

L'objectif est de créer la structure de chaque composant de formulaire, d'implémenter `ControlValueAccessor`, et de les intégrer dans le composant parent.

-   [x] **1. Créer le Composant Parent `MemberAddComponent`**
-   [x] **2. Développer `PersonalInfoFormComponent`**
-   [x] **3. Développer `ContactInfoFormComponent`**
-   [x] **4. Développer `AcademicInfoFormComponent`**
-   [x] **5. Développer `ReligiousKnowledgeFormComponent`**
-   [x] **6. Développer `EngagementsFormComponent`**

## Phase 2 : Logique du Wizard et Fonctionnalités Avancées (Terminée)

-   [x] **1. Mettre en place la navigation du Wizard :**
    -   [x] Dans `MemberAddComponent`, gérer l'état de l'étape actuelle (`currentStep`).
    -   [x] Ajouter les boutons "Suivant" / "Précédent" et la logique pour afficher/cacher les composants enfants.
    -   [x] Ajouter une barre de progression visuelle.

-   [x] **2. Implémenter les `FormArray` :**
    -   [x] Dans `ContactInfoFormComponent` et `ReligiousKnowledgeFormComponent`.

-   [x] **3. Implémenter la logique conditionnelle :**
    -   [x] Dans `ReligiousKnowledgeFormComponent`.

-   [x] **4. Validation et Messages d'Erreur :**
    -   [x] Création et intégration d'un `ValidationMessageComponent` réutilisable.
    -   [x] Ajout des validateurs et des messages d'erreur sur tous les composants du formulaire.

## Phase 3 : Intégration et Finalisation (À FAIRE)

-   [ ] **1. Logique de Soumission :**
    -   [ ] Remplacer les données Mock pour les bourses, clubs, commissions par des appels de service réels.
    -   [ ] Implémenter la méthode `onSubmit()` dans `MemberAddComponent`.
    -   [ ] S'assurer que la méthode `mainForm.getRawValue()` produit un objet conforme au modèle `MemberDataResponse`.
    -   [ ] Appeler le service `MemberHttpService` pour envoyer les données à l'API.

-   [ ] **2. Gestion des Retours API :**
    -   [ ] Gérer les cas de succès (afficher une notification, rediriger l'utilisateur).
    -   [ ] Gérer les cas d'erreur (afficher un message d'erreur à l'utilisateur).

-   [ ] **3. Tests :**
    -   [ ] Écrire des tests unitaires pour la logique de validation de chaque sous-composant.
    -   [ ] Écrire un test d'intégration pour le `MemberAddComponent` qui vérifie la composition et la soumission.

## Phase 4 : Améliorations Post-Lancement (Optionnel)

-   [ ] **Sauvegarde de Brouillon :** Mettre en place une sauvegarde locale (ex: `localStorage`) pour que l'utilisateur puisse reprendre son formulaire plus tard.
-   [ ] **Optimisations :** Analyser les performances, notamment le chargement des listes (clubs, etc.).