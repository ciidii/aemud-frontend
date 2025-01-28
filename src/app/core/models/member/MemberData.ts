import {Member} from "./Member";
import {AcademicInfo} from "./AcademicInfo";
import {AddressInfo} from "./AddressInfo";
import {ContactInfo} from "./ContactInfo";

export interface MemberData {
  id: null,
  personalInfo: {

  },
  membershipInfo: {},
  academicInfo: {},
  addressInfo: {},
  contactInfo: {},
  bourseId: {bourseId: {}},
  clubsId: [{id: {}}],
  commissionsId: [{id: {}}]
}
