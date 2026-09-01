import { PhaseModel } from "./phase.model";

export type MandatStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'CLOSED_ARCHIVED';

export interface PeriodeMandatDto {
  id: string;
  nom: string;
  dateDebut: [number, number, number];
  dateFin: [number, number, number];
  estActif?: boolean;
  estActive?: boolean;
  status?: MandatStatus;
  phases: PhaseModel[];
}
