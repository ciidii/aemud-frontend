import {CreatePhaseModel} from "./CreatePhaseModel";
import {UpdatePhaseModel} from "./UpdatePhaseModel";
import {MandatStatus} from "./periode-mandat.model";

export interface CreatePeriodeMandatModel {
  nom: string;
  dateDebut: string;
  dateFin: string;
  estActif: boolean;
  status?: MandatStatus;
  calculatePhasesAutomatically: boolean;

  numberOfPhases?: number | null;

  // For manual management
  createPhases?: CreatePhaseModel[];
  updatePhases?: UpdatePhaseModel[];
  deletePhaseIds?: string[];
}
