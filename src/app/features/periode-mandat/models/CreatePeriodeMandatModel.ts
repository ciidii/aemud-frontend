import {CreatePhaseModel} from "./CreatePhaseModel";
import {UpdatePhaseModel} from "./UpdatePhaseModel";

export interface CreatePeriodeMandatModel {
  nom: string;
  dateDebut: string;
  dateFin: string;
  estActif: boolean;
  calculatePhasesAutomatically: boolean;

  numberOfPhases?: number | null;

  // For manual management
  createPhases?: CreatePhaseModel[];
  updatePhases?: UpdatePhaseModel[];
  deletePhaseIds?: string[];
}
