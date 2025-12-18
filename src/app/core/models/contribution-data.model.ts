export interface ContributionMonth {
  idContribution: string;
  month: [number, number]; // [year, month]
  status: 'PAID' | 'DELAYED' | 'PENDING' | 'NOT_APPLICABLE' | 'PARTIALLY_PAID';
  montantDu: number;
  montantPaye: number;
}

export interface ContributionYear {
  annee: number;
  mois: ContributionMonth[];
}

export interface ContributionData {
  memberId: string;
  phaseId: string;
  phaseNom: string;
  calendrier: ContributionYear[];
}
