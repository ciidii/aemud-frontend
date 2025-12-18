# Notification & Messaging Feature - Ideas & Roadmap

## 1. Objectif fonctionnel

Mettre en place une fonctionnalité d’envoi de messages groupés (principalement SMS) pour les membres :
- Sélectionner des destinataires (membres / groupes / filtres).
- Composer un message avec compteur SMS.
- Utiliser des templates de message.
- Envoyer via le backend `/notifications/sms` (modèle `SmsModel`).

## 2. MVP indispensable (v1)

1. **Sélection des destinataires**
   - Envoyer à :
     - membres sélectionnés dans une liste,
     - un groupe (ex. « adhérents à jour de cotisation »),
     - tous les membres d’un filtre (ex. « membres sans paiement 2025 »).
   - Réutiliser ou étendre `RecipientTemplateService` pour gérer des groupes / modèles de destinataires.

2. **Message simple avec compteur SMS**
   - Champ texte avec :
     - compteur de caractères,
     - estimation du nombre de SMS (1, 2, 3…).

3. **Confirmation avant envoi**
   - Récapitulatif avant validation :
     - nombre de destinataires,
     - aperçu du message,
     - liste tronquée des numéros si besoin.

4. **Envoi réel + feedback**
   - Appel backend via `NotificationService.sendNotification(SmsModel)`.
   - Feedback utilisateur clair :
     - message de succès,
     - ou message d’erreur lisible.

## 3. Gestion intelligente des destinataires

5. **Nettoyage des numéros**
   - Normalisation :
     - suppression des `+` / espaces,
     - ajout automatique de l’indicatif si manquant (ex. +33).
   - Suppression des doublons.

6. **Ciblage par critères**
   - Filtrer les membres selon :
     - statut (actif / inactif),
     - cotisation payée / non payée,
     - rôle (admin, membre, bénévole), etc.
   - Transmettre les résultats filtrés à la feature notification.

7. **Opt-out / consentement**
   - Flag « ne pas envoyer de SMS » sur un membre.
   - Exclure automatiquement ces membres des envois groupés.

## 4. Templates & personnalisation

8. **Templates de message réutilisables**
   - Gestion des modèles (CRUD) via `MessageTemplateService` :
     - rappel de cotisation,
     - rappel d’événement,
     - message de bienvenue, etc.
   - Intégration dans l’UI d’envoi via un bouton « Utiliser un template ».

9. **Variables dynamiques dans les templates**
   - Exemple de syntaxe : `Bonjour {{prenom}}, votre cotisation {{annee}} est en attente.`
   - Remplacement des variables avec les données du membre au moment de l’envoi.

10. **Aperçu multi-destinataires**
   - Afficher quelques exemples de rendu final :
     - Membre A, Membre B, Membre C.
   - Permet de vérifier que les variables sont correctement renseignées.

## 5. Suivi, historique & fiabilité

11. **Journal des envois (historique)**
   - Liste des envois :
     - date / heure,
     - utilisateur à l’origine de l’envoi,
     - nombre de destinataires,
     - extrait du message.

12. **Statut par destinataire**
   - Si supporté par le backend / provider SMS :
     - envoyé / en attente / échoué.
   - Identifier les numéros invalides.

13. **Relance simple**
   - Depuis l’historique :
     - dupliquer une campagne,
     - renvoyer uniquement aux membres qui n’ont pas reçu / pas répondu.

## 6. Expérience utilisateur & confort

14. **Brouillon automatique**
   - Sauvegarde du message en cours (localStorage ou backend).
   - Proposer à l’utilisateur de reprendre son brouillon à son retour sur l’écran d’envoi.

15. **Test d’envoi**
   - Bouton « M’envoyer un test » : envoi au numéro de l’utilisateur connecté (admin).

16. **Validation forte avant gros envoi**
   - Si le nombre de destinataires dépasse un seuil (ex. 100) :
     - affichage d’un avertissement,
     - éventuellement confirmation explicite (retaper un mot ou le nombre de destinataires).

17. **Récapitulatif après envoi**
   - Exemple de message :
     - « Message envoyé à 185 destinataires (sur 190 sélectionnés). 5 numéros invalides. »
   - Possibilité de voir la liste des numéros invalides.

## 7. Architecture des pages / écrans de la feature Notification

### 7.1. Page "Envoi immédiat" (composer un message)
- Route proposée : `/notifications/messages/new`.
- Objectif : envoyer un message groupé immédiatement.
- Contenu principal :
  - sélection / réception des destinataires (depuis la liste des membres ou via groupes),
  - champ message + compteur SMS,
  - bouton « Utiliser un template » (ouvre le popup de sélection),
  - récapitulatif (nombre de destinataires, éventuellement quelques exemples),
  - bouton « Envoyer maintenant ».

### 7.2. Page "Templates de message" (CRUD)
- Route proposée : `/notifications/templates`.
- Objectif : gérer la bibliothèque de modèles de SMS.
- Contenu :
  - liste des templates (`modelName`, extrait de `smsModel`),
  - actions : créer, modifier, supprimer un template,
  - formulaire de création/édition : nom du template, contenu (avec compteur).
- Ces templates sont utilisés par la page/modal d’envoi et par les envois planifiés.

### 7.3. Page "Historique des envois"
- Route proposée : `/notifications/history`.
- Objectif : assurer la traçabilité des SMS envoyés.
- Contenu :
  - liste des envois (date/heure, type, auteur, nombre de destinataires, extrait du message),
  - filtres (par date, type, auteur),
  - détail d’un envoi (message complet, destinataires, statut par destinataire si disponible).

### 7.4. Page "Groupes / Templates de destinataires"
- Route proposée : `/notifications/recipient-groups`.
- Objectif : définir des segments de membres réutilisables.
- Contenu :
  - liste des groupes (nom, description/règle),
  - actions : créer, modifier, supprimer un groupe,
  - intégration avec l’envoi : possibilité de choisir un groupe comme cible.

### 7.5. Page "Envois planifiés"
- Route proposée : `/notifications/scheduled`.
- Objectif : gérer les messages programmés dans le futur.
- Contenu :
  - liste des envois planifiés (date prévue, template utilisé, cible, statut),
  - actions : créer un envoi planifié, modifier sa date / son contenu, annuler.

### 7.6. (Optionnel) Page "Tableau de bord notifications"
- Route proposée : `/notifications/overview`.
- Objectif : fournir une vue synthétique pour les admins.
- Contenu :
  - indicateurs (nombre de SMS envoyés, top templates, derniers envois),
  - raccourcis vers les autres pages (nouveau message, templates, historique).

## 8. Fonctionnalités avancées (v2+)

18. **Planification (scheduling)**
   - Choisir une date / heure d’envoi :
     - envoyer maintenant,
     - ou programmer (ex. demain à 09:00).

19. **Messages récurrents**
   - Exemples :
     - rappel de réunion mensuelle,
     - rappel de cotisation annuelle.

20. **Multi-canal (évolution)**
   - Support futur d’autres canaux :
     - Email,
     - notifications in-app,
     - push mobile.
   - Templates spécifiques par canal.

## 9. Roadmap suggérée

1. MVP : sélection des destinataires, message simple, confirmation, envoi réel + feedback.
2. Intégration des templates + personnalisation de base (`{{prenom}}`, `{{nom}}`).
3. Page d’envoi immédiat + modal/page de sélection de templates branchée au backend.
4. Historique minimal des envois.
5. Page de gestion des templates (CRUD simple).
6. Test d’envoi + gestion de l’opt-out.
7. Planification et messages récurrents + page des envois planifiés.
8. Groupes de destinataires réutilisables.
9. Éventuelle extension multi-canal et tableau de bord notifications.
