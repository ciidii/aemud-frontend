import {RegistrationModel} from './RegistrationModel';
import {PhaseModel} from "../../features/configuration/periode-mandat/models/phase.model";
import {PeriodeMandatDto} from "../../features/configuration/periode-mandat/models/periode-mandat.model";

export interface RegistrationOverview {
  latestRegistration: RegistrationModel | null;
  nextRegistrablePhase: PhaseModel | null;
}

export interface MandateTimelineItem {
  mandat: PeriodeMandatDto;
  phases: PhaseTimelineItem[];
}

export type PhaseRegistrationStatus =
  | 'REGISTERED'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_REQUIRED'
  | 'BLOCKED_BY_MISSED_MANDATE'
  | 'MISSED_OPEN'
  | 'MISSED_CLOSED'
  | 'PENDING';

export interface PhaseTimelineItem {
  phase: PhaseModel;
  registration: RegistrationModel | null;
  isRegistrable: boolean;
  status: PhaseRegistrationStatus;
}
