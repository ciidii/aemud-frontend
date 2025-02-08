export interface PersonalInfo {
  name: string;
  firstname: string;
  nationality: string;
  gender: string | null;
  birthday: number[];
  maritalStatus: string;
}

export interface MembershipInfo {
  legacyInstitution: string;
  bacSeries: string;
  bacMention: string;
  yearOfBac: string;
  aemudCourses: string;
  otherCourses: string;
  participatedActivity: string;
  politicOrganisation: string;
}

export interface AcademicInfo {
  institutionName: string;
  studiesDomain: string;
  studiesLevel: string;
}

export interface AddressInfo {
  addressInDakar: string;
  holidayAddress: string;
  addressToCampus: string;
}

export interface PersonToCall {
  lastname: string;
  firstname: string;
  requiredNumberPhone: string;
  optionalNumberPhone: string;
  relationship: string;
}

export interface ContactInfo {
  numberPhone: string;
  email: string;
  personToCalls: PersonToCall[];
}

export interface Bourse {
  bourseId: string;
  lebelle: string;
  montant: number;
}

export interface Club {
  id: string;
  name: string;
}

export interface Commission {
  id: string;
  name: string;
}

export interface Registration {
  member: string;
  session: number;
  dateInscription: number[]; // [YYYY, MM, DD]
  registrationType: string;
  statusPayment: boolean;
  registrationStatus: string;
}

export interface Member {
  id: string;
  personalInfo: PersonalInfo;
  membershipInfo: MembershipInfo;
  academicInfo: AcademicInfo;
  addressInfo: AddressInfo;
  contactInfo: ContactInfo;
  bourse: Bourse | null;
  clubs: Club[];
  commissions: Commission[];
  registration: Registration[];
}
