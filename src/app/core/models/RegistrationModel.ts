import {PhaseModel} from "../../features/periode-mandat/models/phase.model";


export enum RegistrationStatus {
  EXPIRED = "EXPIRED",
  COMPLETED = "COMPLETED",
  UNCOMPLETED = "UNCOMPLETED"
}

export enum TypeInscription {
  INITIAL = "INITIAL",
  REINSCRIPTION = "REINSCRIPTION"
}

export interface RegistrationModel {
  id: string;
  member: string;
  mandatName: string;
  phase: PhaseModel;
  dateInscription: string;
  registrationType: TypeInscription;
  statusPayment: boolean;
  registrationStatus: RegistrationStatus;
}
