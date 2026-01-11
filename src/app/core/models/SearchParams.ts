export interface SearchParams {
  page: number;
  rpp: number;
  keyword: string | null;
  club: string[];
  commission: string[];
  paymentStatus: string;
  bourse: string[];
  registrationStatus: string | null;
  mandatIds: string[];
  memberIds?: string[];
  phaseIds: string[];
  registrationType: string | null;
  sortColumn: string;
  sortDirection: boolean;
}
