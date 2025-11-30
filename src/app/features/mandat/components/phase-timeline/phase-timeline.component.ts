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
  @Input() mandateStartDate!: string; // Overall mandate start date
  @Input() mandateEndDate!: string;   // Overall mandate end date
  @Input() phases: TimelinePhase[] = []; // List of phases to display

  timelineSegments: any[] = []; // Calculated segments for the timeline display
  totalMandateDurationDays: number = 0;
  timelineMessage: string = '';
  isTimelineValid: boolean = true;

  ngOnInit(): void {
    this.calculateTimeline();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mandateStartDate'] || changes['mandateEndDate'] || changes['phases']) {
      this.calculateTimeline();
    }
  }

  private calculateTimeline(): void {
    if (!this.mandateStartDate || !this.mandateEndDate) {
      this.timelineSegments = [];
      this.timelineMessage = 'Veuillez définir les dates de début et de fin du mandat.';
      this.isTimelineValid = false;
      return;
    }

    const mandateStart = new Date(this.mandateStartDate);
    const mandateEnd = new Date(this.mandateEndDate);

    if (mandateStart > mandateEnd) {
      this.timelineSegments = [];
      this.timelineMessage = 'La date de début du mandat doit être antérieure à la date de fin.';
      this.isTimelineValid = false;
      return;
    }

    this.totalMandateDurationDays = (mandateEnd.getTime() - mandateStart.getTime()) / (1000 * 3600 * 24);

    if (this.totalMandateDurationDays <= 0) {
      this.timelineSegments = [];
      this.timelineMessage = 'La durée du mandat doit être positive.';
      this.isTimelineValid = false;
      return;
    }

    // Sort phases by start date for easier processing
    const sortedPhases = [...this.phases].sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());

    this.timelineSegments = [];
    let currentPosition = 0; // Represents days from mandateStart
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

      const phaseStartDays = (phaseStart.getTime() - mandateStart.getTime()) / (1000 * 3600 * 24);
      const phaseEndDays = (phaseEnd.getTime() - mandateStart.getTime()) / (1000 * 3600 * 24);
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
          width: (gapDuration / this.totalMandateDurationDays) * 100
        });
        hasGap = true;
      }

      // Add phase segment
      if (phaseDuration > 0) {
        this.timelineSegments.push({
          type: 'phase',
          name: phase.nom,
          duration: phaseDuration,
          width: (phaseDuration / this.totalMandateDurationDays) * 100,
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
    if (currentPosition < this.totalMandateDurationDays) {
      const remainingGap = this.totalMandateDurationDays - currentPosition;
      this.timelineSegments.push({
        type: 'gap',
        duration: remainingGap,
        width: (remainingGap / this.totalMandateDurationDays) * 100
      });
      hasGap = true;
    }

    // Determine overall timeline validity and message
    if (hasPhaseDateOrderInvalid) {
      this.timelineMessage = 'Certaines phases ont une date de début postérieure à leur date de fin.';
      this.isTimelineValid = false;
    } else if (mandateStart > mandateEnd) {
      this.timelineMessage = 'La date de début du mandat doit être antérieure à la date de fin.';
      this.isTimelineValid = false;
    } else if (hasPhaseOutsideMandate) {
      this.timelineMessage = 'Certaines phases dépassent les limites du mandat.';
      this.isTimelineValid = false;
    } else if (hasOverlap) {
      this.timelineMessage = 'Des phases se chevauchent.';
      this.isTimelineValid = false;
    }
  }
}
