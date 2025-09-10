# Feuille de Route : Création du Formulaire d'Inscription des Membres

Ce document détaille les étapes de développement pour la création du nouveau formulaire d'inscription des membres, basé sur une architecture de composants composables et réutilisables.

## Phase 0 : Initialisation et Architecture (Terminée)

-   [x] **Analyse UX/UI :** Définition d'une approche en plusieurs étapes (wizard) pour simplifier l'expérience utilisateur.
-   [x] **Choix d'Architecture :** Adoption d'une stratégie de "Composition de Formulaires Réactifs" avec un composant parent "intelligent" et des composants enfants "réutilisables".
-   [x] **Création de la Feuille de Route :** Rédaction de ce document pour suivre la progression.

## Phase 1 : Développement des Composants de Base

L'objectif est de créer la structure de chaque composant de formulaire, d'implémenter `ControlValueAccessor`, et de les intégrer dans le composant parent.

-   [ ] **1. Créer le Composant Parent `MemberAddComponent` :**
    -   [ ] Générer le composant `features/member/components/member-add/member-add.component.ts`.
    -   [ ] Mettre en place le `mainForm` `FormGroup` qui orchestrera les sous-formulaires.
    -   [ ] Ajouter la route nécessaire pour accéder à ce nouveau formulaire.

-   [ ] **2. Développer `PersonalInfoFormComponent` :**
    -   [ ] Créer le composant.
    -   [ ] Implémenter `ControlValueAccessor`.
    -   [ ] Définir le `FormGroup` interne pour les informations personnelles.
    -   [ ] Créer le template HTML avec les champs correspondants.
    -   [ ] Lier le composant au parent via `formControlName="personalInfo"`.

-   [ ] **3. Développer `ContactInfoFormComponent` :**
    -   [ ] Créer le composant.
    -   [ ] Implémenter `ControlValueAccessor`.
    -   [ ] Définir le `FormGroup` interne (il contiendra un `FormArray` pour les personnes à contacter).
    -   [ ] Créer le template HTML.
    -   [ ] Lier le composant au parent via `formControlName="contactInfo"`.

-   [ ] **4. Développer `AcademicInfoFormComponent` :**
    -   [ ] Répéter le processus : Création, `ControlValueAccessor`, `FormGroup`, Template, Liaison (`formControlName="academicInfo"`).

-   [ ] **5. Développer `ReligiousKnowledgeFormComponent` :**
    -   [ ] Répéter le processus : Création, `ControlValueAccessor`, `FormGroup`, Template, Liaison (`formControlName="religiousKnowledge"`).

-   [ ] **6. Développer `EngagementsFormComponent` :**
    -   [ ] Répéter le processus : Création, `ControlValueAccessor`, `FormGroup`, Template, Liaison (`formControlName="engagements"`).

## Phase 2 : Logique du Wizard et Fonctionnalités Avancées

-   [ ] **1. Mettre en place la navigation du Wizard :**
    -   [ ] Dans `MemberAddComponent`, gérer l'état de l'étape actuelle (`currentStep`).
    -   [ ] Ajouter les boutons "Suivant" / "Précédent" et la logique pour afficher/cacher les composants enfants.
    -   [ ] Ajouter une barre de progression visuelle.

-   [ ] **2. Implémenter les `FormArray` :**
    -   [ ] Dans `ContactInfoFormComponent`, ajouter la logique pour ajouter/supprimer dynamiquement des formulaires pour les "personnes à contacter".

-   [ ] **3. Implémenter la logique conditionnelle :**
    -   [ ] Dans `ReligiousKnowledgeFormComponent`, afficher/cacher les champs de détails en fonction de la valeur de la case à cocher `acquired`.

-   [ ] **4. Validation et Messages d'Erreur :**
    -   [ ] Ajouter des validateurs robustes à tous les champs.
    -   [ ] Afficher des messages d'erreur clairs et conviviaux pour l'utilisateur.

## Phase 3 : Intégration et Finalisation

-   [ ] **1. Logique de Soumission :**
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
