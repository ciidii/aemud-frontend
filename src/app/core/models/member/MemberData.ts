import {Member} from "./Member";
import {AcademicInfo} from "./AcademicInfo";
import {AddressInfo} from "./AddressInfo";
import {ContactInfo} from "./ContactInfo";

export interface MemberData {
  member: Member;
  academicInfo: AcademicInfo;
  addressInfo: AddressInfo;
  contactInfo: ContactInfo;
}
