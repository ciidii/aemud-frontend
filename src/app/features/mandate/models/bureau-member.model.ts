export type BureauRole =
  | 'PRESIDENT'
  | 'VICE_PRESIDENT'
  | 'SECRETAIRE_GENERAL'
  | 'SECRETAIRE_GENERAL_ADJOINT'
  | 'TRESORIER_GENERAL'
  | 'TRESORIER_ADJOINT'
  | 'RESPONSABLE_PEDAGOGIQUE'
  | 'RESPONSABLE_DAARA'
  | 'RESPONSABLE_FEMININE'
  | 'RESPONSABLE_SOCIAL'
  | 'RESPONSABLE_ORGANISATION'
  | 'RESPONSABLE_COMMUNICATION'
  | 'RESPONSABLE_COMMISSION'
  | 'PRESIDENT_CLUB';

export interface BureauMemberModel {
  id: string;
  mandatId: string;
  memberId: string;
  nomComplet: string;
  email?: string;
  telephone?: string;
  role: BureauRole;
  roleTitre: string;
  commissionOuClub?: string;
  estTitulaire: boolean;
  datePriseFonction: string;
  photoUrl?: string;
  statutSignature?: 'SIGNE' | 'EN_ATTENTE';
}
