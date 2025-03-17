import {PersonToCall} from "./person-to-call.model";

export interface MemberModel {
  id: null,
  personalInfo: {},
  membershipInfo: {},
  academicInfo: {},
  addressInfo: {},
  contactInfo: {
    numberPhone: string;
    email: string;
    personToCalls: PersonToCall[];
  },
  bourseId: { bourseId: {} },
  clubsId: [{ id: {} }],
  commissionsId: [{ id: {} }]
}
