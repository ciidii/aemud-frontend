export interface RegistrationRequestWithPhoneNumberDto {
  id?: string;
  memberPhoneNumber: string;
  session: string;
  registrationType: TypeInscription;
  statusPayment: boolean;
  registrationStatus: RegistrationStatus;
}

// Si TypeInscription et RegistrationStatus sont des enums en Java, voici comment les définir en TypeScript :

export enum TypeInscription {
  INITIAL,
  REINSCRIPTION
}

export enum RegistrationStatus {
  EXPIRED,
  PENDING,
  VALID
}
