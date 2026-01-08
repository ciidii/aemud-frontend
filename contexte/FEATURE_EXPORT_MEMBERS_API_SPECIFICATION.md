# Spécification de l'API : Exportation des Membres

**Date :** 2026-01-01

## 1. Introduction

Ce document est destiné à l'équipe frontend (Angular) et décrit la nouvelle fonctionnalité d'exportation des données des membres. L'objectif est de fournir un guide complet pour une intégration rapide et efficace.

---

## 2. Vue d'Ensemble de la Fonctionnalité

### 2.1. Objectif

La fonctionnalité d'export permet aux administrateurs de télécharger une liste de membres dans différents formats de fichier, en choisissant précisément les informations (colonnes) à inclure.

- **Formats supportés :** `EXCEL` (.xlsx), `PDF`, `CSV`.
- **Données exportables :** Toutes les informations liées à un membre, y compris les informations personnelles, académiques, de contact, et le statut de leurs inscriptions.
- **Filtrage :** L'export peut s'appliquer à l'ensemble des membres ou à un sous-ensemble filtré (par exemple, uniquement les membres d'un club spécifique ou ceux inscrits à un certain mandat).

### 2.2. Approche Architecturale

La génération des fichiers est entièrement gérée par le **backend**. Ce choix a été fait pour garantir :
- **Performance et Scalabilité :** Le serveur peut gérer l'export de milliers de membres sans impacter les performances du navigateur de l'utilisateur.
- **Sécurité :** Seules les données explicitement demandées pour l'export sont traitées. Aucune donnée sensible superflue n'est transmise au client.
- **Fiabilité :** Le format des fichiers est standardisé et généré de manière cohérente.

### 2.3. Rôles et Permissions

L'accès à cette fonctionnalité est restreint aux rôles administratifs.
- **Permissions requises :** `ADMIN` ou `SUPER_ADMIN`.

---

## 3. Spécification de l'Endpoint d'Exportation

### 3.1. Endpoint

- **URL :** `/members/export`
- **Méthode HTTP :** `POST`
- **Sécurité :** `@PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")`

### 3.2. Corps de la Requête (`MemberExportRequestDto`)

L'endpoint attend un corps de requête JSON structuré comme suit :

```json
{
  "format": "EXCEL",
  "columns": [
    { "key": "personalInfo.firstName", "header": "Prénom" },
    { "key": "personalInfo.lastName", "header": "Nom de Famille" },
    { "key": "contactInfo.email", "header": "Adresse Email" }
  ],
  "searchRequest": {
    "page": 1,
    "rpp": 9999,
    "keyword": null,
    "paymentStatus": "PAID"
  }
}
```

#### Détail des champs :

- **`format`** (string, requis) : Le format de fichier désiré.
  - Valeurs possibles : `"EXCEL"`, `"PDF"`, `"CSV"`.

- **`columns`** (liste d'objets, requis) : La liste des colonnes à inclure dans l'export.
  - Chaque objet contient :
    - **`key`** (string, requis) : Le chemin d'accès à la donnée à extraire. C'est la partie la plus importante (voir section 4 pour les détails).
    - **`header`** (string, requis) : Le nom qui sera donné à la colonne dans le fichier exporté.

- **`searchRequest`** (objet, requis) : Les critères pour filtrer les membres à exporter.
  - **Important :** Cet objet a **exactement la même structure** que celui utilisé pour l'endpoint `POST /members/search`. Cela permet de garantir que les membres affichés dans l'interface de recherche sont les mêmes que ceux qui seront exportés.
  - Pour exporter **tous les membres** correspondant à un filtre (sans pagination), il est recommandé de mettre un `rpp` (records per page) très élevé (ex: `10000`).

### 3.3. Réponse de l'API

- **En cas de succès :**
  - **Code de statut :** `200 OK`.
  - **Corps de la réponse :** Le contenu binaire du fichier (pas du JSON).
  - **En-têtes HTTP importants :**
    - `Content-Type`: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (pour Excel), `application/pdf` (pour PDF), ou `text/csv` (pour CSV).
    - `Content-Disposition`: `attachment; filename="members.xlsx"` (ou `.pdf`, `.csv`). Cet en-tête indique au navigateur de proposer un téléchargement.

- **En cas d'erreur :**
  - **Code de statut :** `400 BAD REQUEST` (si la requête est mal formée), `403 FORBIDDEN` (si l'utilisateur n'a pas les droits).
  - **Corps de la réponse :** Un objet JSON d'erreur standard.

---

## 4. Guide pour la Sélection des Colonnes (`key`)

La `key` dans l'objet `ColumnDTO` est une chaîne de caractères qui représente le chemin vers la donnée. Elle est construite en naviguant à travers la structure de l'objet `MemberDataResponseDTO`.

Voici des exemples de clés que vous pouvez utiliser :

- **Informations Personnelles :**
  - `personalInfo.name`
  - `personalInfo.firstname`
  - `personalInfo.nationality`
  - `personalInfo.gender`
  - `personalInfo.birthday`
  - `personalInfo.maritalStatus`

- **Informations de Contact :**
  - `contactInfo.email`
  - `contactInfo.numberPhone`

- **Informations Académiques :**
  - `academicInfo.institutionName`
  - `academicInfo.studiesDomain`
  - `academicInfo.studiesLevel`

- **Informations d'Adhésion :**
  - `membershipInfo.legacyInstitution`
  - `membershipInfo.bacSeries`
  - `membershipInfo.yearOfBac`

- **Adresse :**
  - `addressInfo.addressInDakar`
  - `addressInfo.holidayAddress`

**Note :** Le système de mapping actuel est conçu pour extraire des propriétés simples ou des propriétés imbriquées dans des objets uniques. L'extraction de données à partir de listes d'objets (comme les clubs ou les commissions) n'est pas prise en charge dans cette première version et pourra faire l'objet d'une future amélioration.

---

## 5. Actions Requises pour le Frontend (Angular)

### 5.1. Interface Utilisateur

Il est recommandé de créer une modale ou une section dédiée à l'exportation qui contiendrait :
1.  Un sélecteur pour le **format** (boutons radio ou liste déroulante : Excel, PDF, CSV).
2.  Un sélecteur multi-choix ou une liste de cases à cocher pour que l'utilisateur choisisse les **colonnes** qu'il souhaite exporter.
3.  Un bouton "Exporter" qui déclenchera l'appel API.

### 5.2. Logique d'Appel API

1.  **Construire l'objet `MemberExportRequestDto`** à partir des choix de l'utilisateur. L'objet `searchRequest` doit être récupéré à partir de l'état actuel des filtres de votre page de recherche de membres.

2.  **Effectuer la requête `POST`** vers `/members/export`. Il est crucial de configurer `HttpClient` pour qu'il s'attende à une réponse de type binaire (`blob`).

    ```typescript
    // Exemple de service Angular
    import { HttpClient } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    
    @Injectable({ providedIn: 'root' })
    export class ExportService {
      constructor(private http: HttpClient) {}
    
      exportMembers(request: MemberExportRequestDto) {
        return this.http.post('/api/members/export', request, {
          responseType: 'blob', // <-- Très important !
          observe: 'response'   // Pour accéder aux en-têtes HTTP
        });
      }
    }
    ```

3.  **Gérer le téléchargement du fichier** dans le composant qui appelle le service.

    ```typescript
    // Exemple dans un composant
    this.exportService.exportMembers(exportRequest).subscribe(response => {
      // Extraire le nom du fichier depuis l'en-tête Content-Disposition
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'export.dat'; // Nom par défaut
      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Créer une URL pour le blob et simuler un clic pour le téléchargement
      const blob = new Blob([response.body], { type: response.headers.get('content-type') });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
    ```