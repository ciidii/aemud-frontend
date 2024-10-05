import {MembershipInfo} from "./MembershipInfo";
import {PersonalInfo} from "./PersonalInfo";

export interface Member {
  id: string | null;
  personalInfo: PersonalInfo;
  membershipInfo: MembershipInfo;
}
