import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {PeriodeMandatHttpService} from '../../services/periode-mandat-http.service';
import {PeriodeMandatDto} from '../../models/periode-mandat.model';
import {PhaseModel} from '../../models/phase.model';
import {PhaseTimelineComponent} from '../../components/phase-timeline/phase-timeline.component';
import {NotificationService} from '../../../../core/services/notification.service';
import {ArrayDatePipe} from "../../../../core/pipes/array-data.pipe";

@Component({
  selector: 'app-periode-mandat-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, PhaseTimelineComponent, ArrayDatePipe],
  templateUrl: './periode-mandat-detail.component.html',
  styleUrls: ['./periode-mandat-detail.component.scss']
})
export class PeriodeMandatDetailComponent implements OnInit {
  periodeMandat$: Observable<PeriodeMandatDto | null> | undefined;
  currentPhaseId: string | null = null;
  isLoading = true;
  hasError = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private periodeMandatHttpService = inject(PeriodeMandatHttpService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.periodeMandat$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isLoading = true;
          this.hasError = false;
          return this.periodeMandatHttpService.getPeriodeMandatById(id).pipe(
            map(response => response.data),
            finalize(() => this.isLoading = false),
            catchError(err => {
              console.error('Error fetching periode mandat details:', err);
              this.notificationService.showError('Erreur lors de la récupération du détail de la période de mandat.');
              this.hasError = true;
              return of(null);
            })
          );
        } else {
          this.hasError = true;
          this.notificationService.showError('ID de période de mandat non fourni.');
          return of(null);
        }
      })
    );

    this.periodeMandat$.subscribe(periodeMandat => {
      if (periodeMandat) {
        this.currentPhaseId = this.findCurrentPhase(periodeMandat.phases);
      }
    });
  }

  goToEdit(periodeMandatId: string): void {
    this.router.navigate(['/periode-mandats', 'edit', periodeMandatId]);
  }

  private findCurrentPhase(phases: PhaseModel[]): string | null {
    const now = new Date();

    const currentPhase = phases.find(phase => {
      const startDate = this.toDate(phase.dateDebut);
      const endDate = this.toDate(phase.dateFin);
      return now >= startDate && now <= endDate;
    });

    return currentPhase?.id || null;
  }


  protected toDate(dateArray: [number, number, number]): Date {
    if (!dateArray) return new Date(NaN);
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day);
  }
  public dateArrayToString(dateArray: [number, number, number]): string {
    const [year, month, day] = dateArray;
    const pad = (num: number) => num < 10 ? '0' + num : '' + num;
    return `${year}-${pad(month)}-${pad(day)}`;
  }
}
