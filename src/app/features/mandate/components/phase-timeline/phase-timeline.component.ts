import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';

// Assuming a simple structure for displaying phases on the timeline
export interface TimelinePhase {
  nom: string;
  dateDebut: string; // YYYY-MM-DD
  dateFin: string;   // YYYY-MM-DD
  isValid: boolean; // Indicates if this phase is valid (e.g., no overlap, within mandate dates)
  isOverlapping?: boolean; // New: indicates if this phase overlaps with another
  isOutsideMandate?: boolean; // New: indicates if this phase is outside mandate dates
  isDateOrderInvalid?: boolean; // New: indicates if phase start date is after end date
}

@Component({
  selector: 'app-phase-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phase-timeline.component.html',
  styleUrls: ['./phase-timeline.component.scss']
})
export class PhaseTimelineComponent implements OnInit, OnChanges {
  @Input() periodeMandatStartDate!: string; // Overall mandate start date
  @Input() periodeMandatEndDate!: string;   // Overall mandate end date
  @Input() phases: TimelinePhase[] = []; // List of phases to display

  timelineSegments: any[] = []; // Calculated segments for the timeline display
  totalPeriodeMandatDurationDays: number = 0;
  timelineMessage: string = '';
  isTimelineValid: boolean = true;

  ngOnInit(): void {
    this.calculateTimeline();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['periodeMandatStartDate'] || changes['periodeMandatEndDate'] || changes['phases']) {
      this.calculateTimeline();
    }
  }

  private calculateTimeline(): void {
    if (!this.periodeMandatStartDate || !this.periodeMandatEndDate) {
      this.timelineSegments = [];
      this.timelineMessage = 'Veuillez définir les dates de début et de fin de la période de mandat.';
      this.isTimelineValid = false;
      return;
    }

    const periodeMandatStart = new Date(this.periodeMandatStartDate);
    const periodeMandatEnd = new Date(this.periodeMandatEndDate);

    if (periodeMandatStart > periodeMandatEnd) {
      this.timelineSegments = [];
      this.timelineMessage = 'La date de début de la période de mandat doit être antérieure à la date de fin.';
      this.isTimelineValid = false;
      return;
    }

    this.totalPeriodeMandatDurationDays = (periodeMandatEnd.getTime() - periodeMandatStart.getTime()) / (1000 * 3600 * 24);

    if (this.totalPeriodeMandatDurationDays <= 0) {
      this.timelineSegments = [];
      this.timelineMessage = 'La durée de la période de mandat doit être positive.';
      this.isTimelineValid = false;
      return;
    }

    // Sort phases by start date for easier processing
    const sortedPhases = [...this.phases].sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());

    this.timelineSegments = [];
    let currentPosition = 0; // Represents days from periodeMandatStart
    let coverageDays = 0;
    this.isTimelineValid = true; // Assume valid until proven otherwise

    // Variables to track validation state
    let hasOverlap = false;
    let hasGap = false;
    let hasPhaseOutsideMandate = false;
    let hasPhaseDateOrderInvalid = false;
    let totalCoveredDuration = 0;

    for (let i = 0; i < sortedPhases.length; i++) {
      const phase = sortedPhases[i];
      const phaseStart = new Date(phase.dateDebut);
      const phaseEnd = new Date(phase.dateFin);

      const phaseStartDays = (phaseStart.getTime() - periodeMandatStart.getTime()) / (1000 * 3600 * 24);
      const phaseEndDays = (phaseEnd.getTime() - periodeMandatStart.getTime()) / (1000 * 3600 * 24);
      const phaseDuration = phaseEndDays - phaseStartDays;

      // Update global validation flags from individual phase flags
      if (phase.isOverlapping) hasOverlap = true;
      if (phase.isOutsideMandate) hasPhaseOutsideMandate = true;
      if (phase.isDateOrderInvalid) hasPhaseDateOrderInvalid = true;

      // Add gap before current phase if any (using currentPosition from timeline calculation)
      if (phaseStartDays > currentPosition) {
        const gapDuration = phaseStartDays - currentPosition;
        this.timelineSegments.push({
          type: 'gap',
          duration: gapDuration,
          width: (gapDuration / this.totalPeriodeMandatDurationDays) * 100
        });
        hasGap = true;
      }

      // Add phase segment
      if (phaseDuration > 0) {
        this.timelineSegments.push({
          type: 'phase',
          name: phase.nom,
          duration: phaseDuration,
          width: (phaseDuration / this.totalPeriodeMandatDurationDays) * 100,
          isValid: phase.isValid && !phase.isOverlapping && !phase.isOutsideMandate && !phase.isDateOrderInvalid,
          isOverlapping: phase.isOverlapping,
          isOutsideMandate: phase.isOutsideMandate,
          isDateOrderInvalid: phase.isDateOrderInvalid,
        });
        totalCoveredDuration += phaseDuration;
      } else {
        // Invalid phase duration (start >= end) - handled by isDateOrderInvalid
        hasPhaseDateOrderInvalid = true;
      }

      currentPosition = Math.max(currentPosition, phaseEndDays);
    }

    // Add remaining gap after last phase if any
    if (currentPosition < this.totalPeriodeMandatDurationDays) {
      const remainingGap = this.totalPeriodeMandatDurationDays - currentPosition;
      this.timelineSegments.push({
        type: 'gap',
        duration: remainingGap,
        width: (remainingGap / this.totalPeriodeMandatDurationDays) * 100
      });
      hasGap = true;
    }

    // Determine overall timeline validity and message
    if (hasPhaseDateOrderInvalid) {
      this.timelineMessage = 'Certaines phases ont une date de début postérieure à leur date de fin.';
      this.isTimelineValid = false;
    } else if (periodeMandatStart > periodeMandatEnd) {
      this.timelineMessage = 'La date de début de la période de mandat doit être antérieure à la date de fin.';
      this.isTimelineValid = false;
    } else if (hasPhaseOutsideMandate) {
      this.timelineMessage = 'Certaines phases dépassent les limites de la période de mandat.';
      this.isTimelineValid = false;
    } else if (hasOverlap) {
      this.timelineMessage = 'Des phases se chevauchent.';
      this.isTimelineValid = false;
    }
  }
  public dateArrayToString(dateArray: [number, number, number]): string {
    const [year, month, day] = dateArray;
    const pad = (num: number) => num < 10 ? '0' + num : '' + num;
    return `${year}-${pad(month)}-${pad(day)}`;
  }
}
