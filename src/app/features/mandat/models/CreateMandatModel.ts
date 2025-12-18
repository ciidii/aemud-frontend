import {CreatePhaseModel} from "./CreatePhaseModel";

export interface CreateMandatModel {
  nom: string;
  dateDebut: string;  // format: "yyyy-MM-dd"
  dateFin: string;    // format: "yyyy-MM-dd"

  estActive: boolean;
  calculatePhasesAutomatically: boolean;

  numberOfPhases: number | undefined | null; // optionnel (backend accepte null)

  phases?: CreatePhaseModel[]; // optionnel
}
