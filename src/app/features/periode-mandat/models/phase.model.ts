import {PhaseStatus} from "../../../core/models/phaseStatus.enum";


export interface PhaseModel {
  id: string;
  nom: string;
  dateDebut: [number, number, number];
  dateFin: [number, number, number];
  status: string;

  dateDebutInscription: [number, number, number];
  dateFinInscription: [number, number, number];
}
