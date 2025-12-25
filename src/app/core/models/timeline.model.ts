
import {RegistrationModel} from './RegistrationModel';
import {PhaseModel} from "../../features/periode-mandat/models/phase.model";
import {PeriodeMandatDto} from "../../features/periode-mandat/models/periode-mandat.model";

export interface RegistrationOverview {
  latestRegistration: RegistrationModel | null;
  nextRegistrablePhase: PhaseModel | null;
}

export interface MandateTimelineItem {
  mandat: PeriodeMandatDto;
  phases: PhaseTimelineItem[];
}

export interface PhaseTimelineItem {
  phase: PhaseModel;
  registration: RegistrationModel | null;
  isRegistrable: boolean;
  status: 'REGISTERED' | 'MISSED_OPEN' | 'MISSED_CLOSED' | 'PENDING';
}
