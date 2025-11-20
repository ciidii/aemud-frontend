# ✅ BESOIN MÉTIER FINAL — GESTION DES PHASES DE MANDAT

## 🎯 Objectif
Permettre la création et la modification d’un mandat avec gestion de phases manuellement ou automatiquement, dans le respect strict de la période du mandat (date début → date fin), en garantissant une couverture complète à 100 %.

---

# 🟦 A. Création d’un mandat

Lors de la création d’un mandat, l'utilisateur peut générer des phases selon deux modes :

## 1. Création MANUELLE des phases
L’utilisateur définit lui-même :

- Le nombre de phases
- Les dates de début et fin de chaque phase

### Contraintes
- Les phases doivent être entièrement incluses entre les dates du mandat.
- Les phases ne doivent pas se chevaucher.
- 100 % de la durée du mandat doit être couverte par les phases (pas de trous).
- L'utilisateur peut créer autant de phases qu'il veut, tant que la règle 3 est respectée.

---

## 2. Création AUTOMATIQUE des phases

Deux cas sont possibles :

### 2.1 L’utilisateur fournit un nombre de phases **N**
➡️ Le système génère automatiquement **N phases de même durée**.

### 2.2 L’utilisateur ne fournit PAS de nombre de phases
➡️ Le système utilise la valeur par défaut : **2 phases de même durée**.

### Règles supplémentaires
- Les phases doivent couvrir exactement 100 % de la durée du mandat.

---

# 🟦 B. Modification d’un mandat

Lorsqu’un utilisateur modifie les dates du mandat (date début ou fin), il peut choisir :

## 1. Modification MANUELLE des phases
L’utilisateur peut :

- Modifier certaines phases existantes
- Ajouter de nouvelles phases

À condition que :

- Les phases restent dans les nouvelles dates du mandat
- 100 % de la durée du mandat soit couverte
- Les phases ne se chevauchent pas

---

## 2. Modification AUTOMATIQUE des phases

### 2.1 L’utilisateur fournit un nouveau nombre de phases **N**
Lors de la modification automatique avec un nombre de phases fourni :

- **Aucune phase existante n’est supprimée.**

Le système :

- Réutilise les phases existantes
- Ajuste/modifie leurs dates de début et fin
- Crée des phases supplémentaires si le nombre demandé (**N**) est supérieur au nombre de phases existantes
- Réduit le nombre de phases si **N** est inférieur, en fusionnant ou réorganisant les phases

Dans tous les cas :

- Le nombre final de phases = **N**
- Les phases couvrent **100 %** de la nouvelle durée du mandat
- La répartition se fait en phases de même durée
- Tout surplus non divisible est ajouté à la **première phase**

---

### 2.2 L’utilisateur ne fournit PAS de nombre de phases
➡️ Le système conserve **le même nombre de phases qu’avant la modification**, mais recalcule automatiquement :

- La nouvelle date de début de chaque phase
- La nouvelle date de fin de chaque phase

Avec les règles suivantes :

- Les phases doivent couvrir **100 %** du nouveau mandat
- Les durées sont ajustées proportionnellement
- Si la répartition n’est pas parfaite, le surplus est ajouté à la **première phase**  
