export interface PvPassationModel {
  id: string;
  mandatSortantId: string;
  mandatEntrantId: string;
  datePassation: string;
  documentUrl?: string;
  notes?: string;
  signataires: {
    nom: string;
    role: string;
    dateSignature: string;
  }[];
  statut: 'BROUILLON' | 'SIGNE' | 'ARCHIVE_DEFINITIF';
}
