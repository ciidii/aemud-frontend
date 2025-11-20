import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, finalize } from 'rxjs/operators';
import { MandatHttpService } from '../../services/mandat-http.service';
import { MandatDto } from '../../models/mandat.model';
import { PhaseModel } from '../../models/phase.model';
import { PhaseTimelineComponent } from '../../components/phase-timeline/phase-timeline.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-mandat-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, PhaseTimelineComponent],
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

  private findCurrentPhase(phases: PhaseModel[]): string | null {
    const now = new Date();
    const currentPhase = phases.find(phase => {
      const startDate = new Date(phase.dateDebut);
      const endDate = new Date(phase.dateFin);
      return now >= startDate && now <= endDate;
    });
    return currentPhase ? currentPhase.id : null;
  }

  goToEdit(mandatId: string): void {
    this.router.navigate(['/mandats', 'edit', mandatId]);
  }
}
