### **Philosophie de Conception**

1.  **Guidage Actif :** L'interface ne doit pas seulement valider les données à la fin, mais guider l'utilisateur à chaque étape pour l'empêcher de créer des configurations invalides.
2.  **Cohérence Visuelle :** Utiliser les couleurs (`$primary-base`, `$gray-x`), la typographie (`@mixin text-body-regular`) et les espacements (`$space-x`) existants pour une intégration parfaite.
3.  **Feedback Instantané :** L'utilisateur doit voir immédiatement l'impact de ses choix (par exemple, la modification d'une date ou le changement de mode de gestion).

---

### **Proposition d'Interface : Écran de Création / Édition d'un Mandat**

Je propose un formulaire sur une seule page, divisé en deux sections claires.

#### **1. Informations Générales du Mandat**

Cette section est simple et regroupe les champs principaux du mandat.

*   **Nom du mandat :** Un champ de texte simple. (`<input type="text">`)
*   **Date de début / Date de fin :** Deux champs de sélection de date (`<input type="date">`). Ces dates définiront le cadre de référence pour toute la gestion des phases.
*   **Mandat actif :** Un interrupteur (toggle switch) pour `estActive`, plus moderne qu'une simple case à cocher.

#### **2. Gestion des Phases : Le Cœur de l'Interface**

C'est ici que la magie opère. La complexité sera gérée par un composant interactif.

*   **Sélecteur de Mode :** Au centre de tout, un sélecteur à deux options (boutons radios stylisés ou "segmented control") :
    *   `[ Génération Automatique ]`
    *   `[ Gestion Manuelle ]`

Le choix de l'utilisateur ici reconfigure dynamiquement l'interface affichée en dessous.

##### **A) Si "Génération Automatique" est sélectionnée :**

L'interface devient minimale et directe.

*   On affiche un seul champ optionnel :
    *   **Nombre de phases :** `<input type="number">`
    *   **Label :** "Nombre de phases souhaité"
    *   **Texte d'aide :** "Laissez vide pour générer 2 phases de durée égale. Le système couvrira 100% de la période du mandat."

C'est tout. Simple, efficace, et correspond parfaitement au besoin.

##### **B) Si "Gestion Manuelle" est sélectionnée :**

L'interface se transforme en un outil d'édition plus riche.

1.  **La Timeline de Couverture (Composant Clé) :**
    *   Juste en dessous du sélecteur de mode, une barre de progression visuelle **horizontale** s'affiche.
    *   Cette barre représente **100% de la durée du mandat** (de la `dateDebut` à la `dateFin` choisies plus haut).
    *   Chaque phase ajoutée par l'utilisateur apparaît comme un **segment coloré** sur cette barre. On utilisera `$primary-500` pour les phases valides.
    *   **Feedback Visuel Immédiat :**
        *   Les "trous" (périodes non couvertes) apparaissent comme des **vides hachurés** dans la barre.
        *   Les "chevauchements" peuvent être signalés en colorant les segments concernés avec une couleur d'erreur (`$danger-500`) et en affichant une icône d'alerte.
    *   Un texte est affiché au-dessus de la timeline :
        *   Si tout va bien : **"Couverture du mandat : 100%"** (en couleur `$success-500`).
        *   Sinon : **"Couverture incomplète : 85% (15% manquant)"** ou **"Erreur : Des phases se chevauchent"** (en couleur `$danger-500`).

2.  **Liste des Phases :**
    *   En dessous de la timeline, on trouve la liste des phases.
    *   Chaque phase est une ligne (ou une "carte" utilisant `$color-background-panel` et `$shadow-sm`) avec les champs suivants :
        *   `Nom de la phase` (input texte)
        *   `Date de début` (input date)
        *   `Date de fin` (input date)
        *   `Date début/fin inscription` (champs optionnels)
        *   Un bouton `Supprimer` (icône poubelle) pour chaque phase.
    *   Toute modification d'une date dans un champ met **instantanément** à jour la timeline visuelle au-dessus.

3.  **Bouton d'Action :**
    *   Un bouton **"+ Ajouter une phase"** est présent en bas de la liste pour ajouter dynamiquement une nouvelle ligne de formulaire de phase.

---

### **Parcours Utilisateur type (Création)**

1.  L'utilisateur arrive sur le formulaire. Par défaut, le mode **"Génération Automatique"** est sélectionné.
2.  Il remplit le nom du mandat, choisit une date de début (ex: 01/01/2026) et de fin (ex: 31/12/2026).
3.  Il laisse le champ "Nombre de phases" vide et sauvegarde. Le backend créera 2 phases. C'est le chemin le plus rapide.
4.  *Autre scénario :* Après avoir rempli les dates, il clique sur **"Gestion Manuelle"**.
5.  L'interface bascule : la timeline de couverture apparaît, initialement vide et hachurée, indiquant "Couverture : 0%".
6.  Il clique sur "+ Ajouter une phase". Un formulaire pour la Phase 1 apparaît.
7.  Il entre les dates 01/01/2026 -> 30/06/2026. La timeline se met à jour et montre un segment qui remplit la première moitié de la barre. Le texte indique "Couverture : 50%".
8.  Il ajoute une deuxième phase. Il se trompe et entre 15/06/2026 -> 15/12/2026. La timeline colore les deux segments en rouge (`$danger-500`) et affiche le message "Erreur : Chevauchement".
9.  Il corrige la date de début de la Phase 2 pour être 01/07/2026. La timeline redevient bleue (`$primary-500`) car le chevauchement est résolu. Le texte indique "Couverture : 96% (4% manquant)".
10. Il ajuste la date de fin de la Phase 2 au 31/12/2026. La timeline est maintenant pleine. Le texte passe au vert : "Couverture : 100%".
11. Il peut maintenant sauvegarder.

---

### **Composants Angular à Créer**

Pour implémenter cette conception dans `src/app/features/mandat/`, nous aurons besoin de :

1.  `pages/mandat-list/` : Pour afficher tous les mandats existants avec un bouton "Créer un mandat".
2.  `pages/mandat-add-edit/mandat-add-edit.component.ts` : Le composant principal qui contiendra la logique du formulaire.
3.  `components/phase-timeline/phase-timeline.component.ts` : Le composant réutilisable pour la **timeline de couverture visuelle**. C'est un investissement qui rendra l'UX excellente.
4.  `components/phase-form-item/phase-form-item.component.ts` : Un sous-composant pour le formulaire d'une seule phase, qui sera répété dans la liste manuelle.