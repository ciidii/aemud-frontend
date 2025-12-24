export interface UpdatePhaseModel {
  id: string;
  nom: string;
  dateDebut: string;  // "yyyy-MM-dd"
  dateFin: string;
  dateDebutInscription?: string;
  dateFinInscription?: string;
}
