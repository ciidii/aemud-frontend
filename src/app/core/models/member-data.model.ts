import {BourseModel} from "./bourse.model";

export interface MemberDataResponse {
  id: string;
  personalInfo: PersonalInfo;
  membershipInfo: MembershipInfo;
  academicInfo: AcademicInfoRequest;
  addressInfo: AddressInfoRequest;
  contactInfo: ContactInfoRequest;
  bourse: BourseModel;
  clubs: Club[];
  commissions: Commission[];
  registration: RegistrationResponse[];
  religiousKnowledge: ReligiousKnowledge;
}

export interface PersonalInfo {
  name: string;
  firstname: string;
  nationality: string;
  gender: string;
  birthday: number[]; // LocalDate is string in JSON
  maritalStatus: MaritalStatus;
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

export interface AcademicInfoRequest {
  institutionName: string;
  studiesDomain: string;
  studiesLevel: string;
}

export interface AddressInfoRequest {
  addressInDakar: string;
  addressToCampus: string;
}

export interface ContactInfoRequest {
  numberPhone: string;
  email: string;
  personToCalls: PersonToCall[];
}

export interface PersonToCall {
  lastname: string;
  firstname: string;
  requiredNumberPhone: string;
  optionalNumberPhone: string;
  relationship: string;
}

export interface Bourse {
  members: string[];
  bourseId: string;
  lebelle: string;
  montant: number;
}

export interface Club {
  id: string;
  name: string;
  members: string[];
}

export interface Commission {
  members: string[];
  id: string;
  name: string;
}

export interface RegistrationResponse {
  member: string;
  sessionId: string;
  dateInscription: number[];
  registrationType: TypeInscription;
  statusPayment: boolean;
  registrationStatus: RegistrationStatus;
}

export enum ArabicProficiency {
  CANNOT_READ = 'CANNOT_READ',
  READ_ONLY = 'READ_ONLY',
  READ_AND_UNDERSTAND = 'READ_AND_UNDERSTAND'
}

export interface ReligiousKnowledge {
  arabicProficiency: ArabicProficiency;
  coranLevel: CORAN_LEVEL;
  aqida: Knowledge[];
  fiqh: Knowledge[];
}

export interface Knowledge {
  acquired: boolean;
  bookName: string;
  teacherName: string;
  learningPlace: string;
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED'
}

export enum RegistrationStatus {
  EXPIRED = "EXPIRED",
  COMPLETED = "COMPLETED",
  UNCOMPLETED = "UNCOMPLETED",
}

export enum TypeInscription {
  REINSCRIPTION = 'REINSCRIPTION'
}

export enum CORAN_LEVEL {
  AMMAH = 'AMMAH',
  TABAARAKA = 'TABAARAKA',
  MUDJADALA = 'MUDJADALA',
  YASIN = 'YASIN',
  FURQANA = 'FURQANA'
}

