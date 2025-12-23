import {PhaseModel} from "./phase.model";


export interface PeriodeMandatDto {
  id: string;
  nom: string;
  dateDebut: [number, number,number];
  dateFin: [number, number,number];
  estActif: boolean;
  phases: PhaseModel[];
}
