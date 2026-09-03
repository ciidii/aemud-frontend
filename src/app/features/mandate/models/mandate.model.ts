import {PhaseModel, CreatePhaseModel, UpdatePhaseModel} from './phase.model';

export type MandatStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED_ARCHIVED';
export type MandateStatus = MandatStatus;

export interface PeriodeMandatDto {
  id: string;
  nom: string;
  description?: string;
  slogan?: string;
  dateDebut: [number, number, number];
  dateFin: [number, number, number];
  estActif?: boolean;
  estActive?: boolean;
  status?: MandatStatus;
  phases: PhaseModel[];
  createdAt?: string;
  updatedAt?: string;
}

export type MandateModel = PeriodeMandatDto;

export interface CreateMandateModel {
  nom: string;
  description?: string;
  slogan?: string;
  dateDebut: string;
  dateFin: string;
  estActif?: boolean;
  status?: MandatStatus;
  calculatePhasesAutomatically?: boolean;
  numberOfPhases?: number | null;
  phases?: {
    nom: string;
    dateDebut: string;
    dateFin: string;
    dateDebutInscription?: string;
    dateFinInscription?: string;
  }[];
  createPhases?: CreatePhaseModel[];
  updatePhases?: UpdatePhaseModel[];
  deletePhaseIds?: string[];
}

export type CreatePeriodeMandatModel = CreateMandateModel;
