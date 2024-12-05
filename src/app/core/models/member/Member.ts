import {MembershipInfo} from "./MembershipInfo";
import {PersonalInfo} from "./PersonalInfo";

export interface Member {
  id: number;
  personalInfo: PersonalInfo;
  membershipInfo: MembershipInfo;
}
