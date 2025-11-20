import {PhaseStatus} from "../../../core/models/phaseStatus.enum";


export interface PhaseModel {
  id: string;
  nom: string;
  dateDebut: string; // LocalDate in Java maps to string in TypeScript
  dateFin: string; // LocalDate in Java maps to string in TypeScript
  status: PhaseStatus;
  dateDebutInscription: string;
  dateFinInscription: string;
}
