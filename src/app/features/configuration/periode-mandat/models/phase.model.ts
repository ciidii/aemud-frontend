export type PhaseStatus = 'PASSED' | 'CURRENT' | 'FUTURE' | 'EXTENDED' | 'CLOSED';

export interface PhaseModel {
  id: string;
  nom: string;
  dateDebut: [number, number, number];
  dateFin: [number, number, number];
  status: PhaseStatus | string;
  dateDebutInscription: [number, number, number];
  dateFinInscription: [number, number, number];
  motifProlongation?: string;
}
