import { MandatDto } from '../../features/mandat/models/mandat.model';
import { PhaseModel } from '../../features/mandat/models/phase.model';
import { RegistrationModel } from './RegistrationModel';

export interface RegistrationOverview {
  latestRegistration: RegistrationModel | null;
  nextRegistrablePhase: PhaseModel | null;
}

export interface MandateTimelineItem {
  mandat: MandatDto;
  phases: PhaseTimelineItem[];
}

export interface PhaseTimelineItem {
  phase: PhaseModel;
  registration: RegistrationModel | null;
  isRegistrable: boolean;
  status: 'REGISTERED' | 'MISSED_OPEN' | 'MISSED_CLOSED' | 'PENDING';
}
