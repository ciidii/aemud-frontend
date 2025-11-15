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
  member: string;
  session: number;
  dateInscription: number[];
  registrationType: TypeInscription;
  statusPayment: boolean;
  registrationStatus: RegistrationStatus;
}
