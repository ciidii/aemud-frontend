import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {MandatHttpService} from '../../services/mandat-http.service';
import {MandatDto} from '../../models/mandat.model';
import {PhaseModel} from '../../models/phase.model';
import {PhaseTimelineComponent} from '../../components/phase-timeline/phase-timeline.component';
import {NotificationService} from '../../../../core/services/notification.service';
import {ArrayDatePipe} from "../../../../core/pipes/array-data.pipe";

@Component({
  selector: 'app-mandat-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, PhaseTimelineComponent, ArrayDatePipe],
  templateUrl: './mandat-detail.component.html',
  styleUrls: ['./mandat-detail.component.scss']
})
export class MandatDetailComponent implements OnInit {
  mandat$: Observable<MandatDto | null> | undefined;
  currentPhaseId: string | null = null;
  isLoading = true;
  hasError = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mandatHttpService = inject(MandatHttpService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.mandat$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isLoading = true;
          this.hasError = false;
          return this.mandatHttpService.getMandatById(id).pipe(
            map(response => response.data),
            finalize(() => this.isLoading = false),
            catchError(err => {
              console.error('Error fetching mandat details:', err);
              this.notificationService.showError('Erreur lors de la récupération du détail du mandat.');
              this.hasError = true;
              return of(null);
            })
          );
        } else {
          this.hasError = true;
          this.notificationService.showError('ID de mandat non fourni.');
          return of(null);
        }
      })
    );

    this.mandat$.subscribe(mandat => {
      if (mandat) {
        this.currentPhaseId = this.findCurrentPhase(mandat.phases);
      }
    });
  }

  goToEdit(mandatId: string): void {
    this.router.navigate(['/mandats', 'edit', mandatId]);
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


  private toDate(dateArray: [number, number, number]): Date {
    if (!dateArray) return new Date(NaN);
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day);
  }

}
