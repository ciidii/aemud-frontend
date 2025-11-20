export interface CreatePhaseModel {
  nom: string;
  dateDebut: string;  // "yyyy-MM-dd"
  dateFin: string;
  dateDebutInscription?: string;
  dateFinInscription?: string;
}
