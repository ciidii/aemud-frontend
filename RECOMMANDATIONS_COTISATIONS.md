# Recommandations UX/UI pour le Calendrier des Cotisations

Ce document détaille les améliorations proposées pour le module de suivi des cotisations sur la page de détail d'un membre. L'objectif est de transformer l'affichage actuel en une interface de gestion complète, intuitive et professionnelle.

## Analyse de l'Existant

Le calendrier actuel est une bonne base. Voici ce qu'il fait déjà :
- **Affichage par Session :** On peut sélectionner une session (ex: 2024-2025) via une liste déroulante.
- **Grille des Mois :** Une grille montre les 12 mois de la session.
- **Statut Visuel :** Les mois payés (`paid`) et non payés (`unpaid`) sont différenciés par une couleur.
- **Action de Rappel :** Un bouton "Envoyer un rappel" est présent.

## Axes d'Amélioration Majeurs

Pour rendre cette fonctionnalité véritablement utile, voici les éléments manquants, classés par ordre de priorité.

### 1. Interactivité et Actions Directes (Priorité Haute)

L'utilisateur peut *voir* le statut, mais ne peut pas *agir* dessus. C'est le principal point de friction.

-   **[À FAIRE] Enregistrer un paiement :** Permettre à l'utilisateur de cliquer sur un mois "non payé" pour ouvrir une modale et confirmer la réception du paiement. La modale devrait permettre de spécifier au minimum la date et le montant.
-   **[À FAIRE] Gérer les paiements multiples :** Ajouter la possibilité de sélectionner plusieurs mois (via `Ctrl+Clic` ou des cases à cocher) et de les marquer comme payés en une seule action.
-   **[À FAIRE] Consulter les détails d'un paiement :** Permettre de cliquer sur un mois déjà "payé" pour afficher les détails de la transaction (date, montant, méthode de paiement, etc.) dans un pop-up ou une section dédiée.

### 2. Clarté et Contexte (Priorité Moyenne)

L'interface doit fournir toutes les informations nécessaires pour une prise de décision rapide, sans ambiguïté.

-   **[À FAIRE] Ajouter une légende :** Intégrer une légende visuelle simple qui explique la signification des couleurs (ex: 🟩 Payé, ⬜️ En attente, 🟧 En retard).
-   **[À FAIRE] Intégrer un résumé financier :** Afficher un bloc de résumé au-dessus de la grille avec des informations clés pour la session sélectionnée :
    -   Total Payé
    -   Total Restant Dû
    -   Taux de complétion (ex: "8/12 mois payés")
-   **[À FAIRE] Affiner les statuts :** Remplacer le statut binaire "unpaid" par des statuts plus descriptifs et visuellement distincts :
    -   **À venir :** Pour les mois futurs non encore échus.
    -   **Dû :** Pour le mois en cours.
    -   **En retard :** Pour les mois passés non payés.

### 3. Feedback et Finitions (Priorité Moyenne)

Améliorer la fluidité de l'expérience pour la rendre plus professionnelle et rassurante.

-   **[À FAIRE] Fournir un feedback après action :** Après un clic sur "Envoyer un rappel" ou l'enregistrement d'un paiement, afficher une notification de succès ou d'échec (ex: "Rappel envoyé avec succès").
-   **[À FAIRE] Rendre les boutons contextuels :** Le bouton "Envoyer un rappel" devrait étre désactivé si toutes les cotisations sont à jour.
-   **[À FAIRE] Améliorer les états de chargement/vide :**
    -   Afficher un indicateur de chargement (spinner) au sein du composant lors du changement d'année.
    -   Afficher un message clair ("Aucune donnée de cotisation pour cette session") si aucune information n'est disponible.
-   **[À FAIRE] Augmenter l'affordance :** Rendre les boétes des mois plus interactives (ex: les transformer en boutons `<button>`, ajouter des effets au survol) pour indiquer qu'elles sont cliquables.

## Conclusion

En se concentrant sur l'ajout d' **interactivité directe**, on peut transformer ce module d'un simple affichage informatif en un véritable outil de gestion qui fera gagner un temps précieux aux administrateurs. L'étape la plus impactante serait de permettre l' **enregistrement d'un paiement directement depuis le calendrier**.
