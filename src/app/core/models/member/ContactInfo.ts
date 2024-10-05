import {PersonToCall} from "./PersonToCall";

export interface ContactInfo {
  memberID: string | null;
  idYear: string | null;
  numberPhone: string;
  email: string;
  personToCalls: PersonToCall[];
}
