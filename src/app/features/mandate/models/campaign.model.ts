export type CampaignType = 'INITIALE' | 'RATTRAPAGE' | 'REGULARISATION';

export interface CampaignModel {
  id: string;
  phaseId: string;
  nom: string;
  type: CampaignType;
  dateDebut: string;
  dateFin: string;
  estActive: boolean;
  prolongations?: {
    dateProlongation: string;
    nouvelleDateFin: string;
    motif: string;
    auteur: string;
  }[];
}
