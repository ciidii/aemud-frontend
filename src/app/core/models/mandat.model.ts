import {PhaseModel} from "./phase.model";


export interface MandatDto {
  id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  estActif: boolean;
  phases: PhaseModel[];
}
