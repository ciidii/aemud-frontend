# Recommandations UX/UI pour la Liste des Membres

Ce document résume les améliorations proposées pour l'interface de la liste des membres, visant à la rendre plus intuitive, efficace et moderne.

## 1. Structure Générale et Actions Principales

### Barre d'en-tête (`app-table-header`)
- [ ] **Déplacer l'action d'ajout principale** :
  - Déplacer le bouton `Add` de la barre de filtres vers l'en-tête principal.
  - Le renommer en **"Ajouter un membre"** pour plus de clarté.
  - *Raison : L'en-tête est l'endroit logique pour les actions globales qui affectent toute la liste.*

### Barre de filtres (`app-table-filters`)
- [ ] **Rendre le bouton de filtres dynamique** :
  - Quand des filtres sont actifs, faire évoluer le bouton `Filters`.
  - Par exemple, changer sa couleur et afficher le nombre de filtres actifs : **`Filtres (3)`**.
  - *Raison : Fournit un retour visuel immédiat à l'utilisateur.*

- [ ] **Ajouter la personnalisation des colonnes** :
  - Ajouter un bouton (ex: "Colonnes" ou une icône d'engrenage) qui permet à l'utilisateur d'afficher ou de masquer les colonnes du tableau.
  - *Raison : Permet de désencombrer l'interface et de l'adapter aux besoins de l'utilisateur.*

## 2. Contenu du Tableau (`app-table-body`)

- [ ] **Rendre les lignes entièrement cliquables** :
  - Permettre la navigation vers le détail d'un membre en cliquant n'importe où sur la ligne.
  - Changer le curseur en pointeur au survol de la ligne.
  - *Raison : Améliore la fluidité et la rapidité de la navigation.*

- [ ] **Utiliser un menu d'actions par ligne** :
  - Remplacer le bouton unique `Voir` par une icône "kebab" (trois points verticaux).
  - Ce menu contiendrait les actions spécifiques à la ligne : **"Voir les détails"**, **"Modifier"**, **"Désactiver"**, **"Supprimer"**.
  - *Raison : Design plus propre, plus scalable et standard dans les applications modernes.*

- [ ] **Ajouter une case "Tout sélectionner"** :
  - Placer une case à cocher dans la cellule d'en-tête (`<th>`) de la première colonne pour sélectionner/désélectionner toutes les lignes de la page visible.
  - *Raison : Facilite grandement les actions de groupe.*

## 3. Pied de Page et Actions de Groupe

- [ ] **Dissocier la Pagination des Actions de Groupe** :
  - **Le point le plus important.** La pagination doit toujours être visible, alors que les actions de groupe ne sont pertinentes que lors d'une sélection.

- [ ] **Créer une barre de pagination permanente** :
  - Ce nouveau composant ne gérera que la pagination.
  - Il doit être **toujours visible**, idéalement en bas à droite du conteneur du tableau.

- [ ] **Rendre le pied de page (`app-table-footer`) contextuel** :
  - Cette barre ne doit apparaître **que lorsqu'au moins un élément est sélectionné**.
  - Elle contiendra le résumé de la sélection (ex: **"5 membres sélectionnés"**) et les boutons d'actions de groupe (`Exporter`, `Imprimer`, `Supprimer`).
  - *Raison : Allège l'interface et ne montre les actions puissantes que lorsqu'elles sont utiles.*

- [ ] **Ajouter une confirmation pour la suppression** :
  - Pour l'action `Supprimer` du pied de page, toujours afficher une modale de confirmation claire avant de procéder. (ex: "Êtes-vous sûr de vouloir supprimer les 5 membres sélectionnés ?").
  - *Raison : Prévient les erreurs destructrices.*

## 4. États de l'Interface

- [ ] **Prévoir un état "vide" (Empty State)** :
  - Si la liste est vide ou qu'une recherche ne renvoie aucun résultat, afficher un message centré avec une icône.
  - Ex: "Aucun membre trouvé." avec un bouton "Ajouter un membre".
  - *Raison : Guide l'utilisateur et améliore l'expérience d'une page vide.*

- [ ] **Prévoir un état de "chargement" (Loading State)** :
  - Pendant que les données sont récupérées, afficher un indicateur de chargement.
  - L'idéal est d'utiliser des **"skeleton loaders"** (des formes grisées qui imitent la structure du tableau).
  - *Raison : Informe l'utilisateur que le système travaille et améliore la perception de la vitesse.*
