import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, DatePipe, NgFor, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map, switchMap, tap} from 'rxjs/operators';
import {FormsModule} from '@angular/forms';
import {PeriodeMandatHttpService} from '../../services/periode-mandat-http.service';
import {PhaseHttpService} from '../../services/phase-http.service';
import {PeriodeMandatDto} from '../../models/periode-mandat.model';
import {PhaseModel} from '../../models/phase.model';
import {PhaseTimelineComponent} from '../../components/phase-timeline/phase-timeline.component';
import {ArrayDatePipe} from "../../../../../core/pipes/array-data.pipe";
import {NotificationService} from "../../../../../core/services/notification.service";
import {AppStateService} from "../../../../../core/services/app-state.service";
import {ConfirmDeleteModalComponent} from "../../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";

@Component({
  selector: 'app-periode-mandat-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AsyncPipe,
    NgIf,
    NgFor,
    FormsModule,
    DatePipe,
    PhaseTimelineComponent,
    ArrayDatePipe,
    ConfirmDeleteModalComponent
  ],
  templateUrl: './periode-mandat-detail.component.html',
  styleUrls: ['./periode-mandat-detail.component.scss']
})
export class PeriodeMandatDetailComponent implements OnInit {
  periodeMandat$: Observable<PeriodeMandatDto | null> | undefined;
  isLoading = true;
  hasError = false;
  currentMandat: PeriodeMandatDto | null = null;
  mandatId: string | null = null;

  // Activation state
  isActivating = false;

  // Delete modal
  isDeleteModalOpen = false;

  // Campaign modal
  isCampaignModalOpen = false;
  selectedPhaseForCampaign: PhaseModel | null = null;
  campaignStartDate = '';
  campaignEndDate = '';
  isSubmittingCampaign = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private periodeMandatHttpService = inject(PeriodeMandatHttpService);
  private phaseHttpService = inject(PhaseHttpService);
  private appStateService = inject(AppStateService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.mandatId = this.route.snapshot.paramMap.get('id');
    this.loadMandat();
  }

  loadMandat(): void {
    if (!this.mandatId) {
      this.hasError = true;
      this.notificationService.showError('ID de période de mandat non fourni.');
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.periodeMandat$ = this.periodeMandatHttpService.getPeriodeMandatById(this.mandatId).pipe(
      map(response => response.data),
      tap(mandat => {
        this.currentMandat = mandat;
      }),
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Error fetching periode mandat details:', err);
        this.notificationService.showError('Erreur lors de la récupération du détail de la période de mandat.');
        this.hasError = true;
        return of(null);
      })
    );
  }

  goToEdit(periodeMandatId: string): void {
    this.router.navigate(['/periode-mandats', 'edit', periodeMandatId]);
  }

  activateMandat(mandat: PeriodeMandatDto): void {
    if (mandat.estActif) return;
    this.isActivating = true;
    this.periodeMandatHttpService.activatePeriodeMandat(mandat.id).subscribe({
      next: (res) => {
        this.isActivating = false;
        this.notificationService.showSuccess(`Le mandat "${mandat.nom}" a été activé avec succès.`);
        if (res.data) {
          this.appStateService.setSelectedMandat(res.data);
        }
        this.loadMandat();
      },
      error: (err) => {
        this.isActivating = false;
        this.notificationService.showError("Impossible d'activer ce mandat.");
        console.error('Failed to activate mandat', err);
      }
    });
  }

  openDeleteModal(): void {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  confirmDelete(): void {
    if (!this.mandatId) return;
    this.periodeMandatHttpService.deletePeriodeMandat(this.mandatId).subscribe({
      next: () => {
        this.notificationService.showSuccess("Le mandat a été supprimé avec succès.");
        this.closeDeleteModal();
        this.router.navigate(['/periode-mandats', 'list']);
      },
      error: (err) => {
        this.notificationService.showError("Erreur lors de la suppression du mandat.");
        console.error('Failed to delete mandat', err);
        this.closeDeleteModal();
      }
    });
  }

  // Campaign management
  openCampaignModal(phase: PhaseModel): void {
    this.selectedPhaseForCampaign = phase;
    this.campaignStartDate = this.dateArrayToString(phase.dateDebutInscription) || this.dateArrayToString(phase.dateDebut);
    this.campaignEndDate = this.dateArrayToString(phase.dateFinInscription) || this.dateArrayToString(phase.dateFin);
    this.isCampaignModalOpen = true;
  }

  closeCampaignModal(): void {
    this.isCampaignModalOpen = false;
    this.selectedPhaseForCampaign = null;
  }

  submitOpenCampaign(): void {
    if (!this.selectedPhaseForCampaign || !this.campaignStartDate || !this.campaignEndDate) {
      this.notificationService.showError("Veuillez renseigner les dates de début et de fin de campagne.");
      return;
    }

    this.isSubmittingCampaign = true;
    this.phaseHttpService.openRegistrationCampaign(
      this.selectedPhaseForCampaign.id,
      this.campaignStartDate,
      this.campaignEndDate
    ).subscribe({
      next: () => {
        this.isSubmittingCampaign = false;
        this.notificationService.showSuccess(`Campagne d'adhésion pour la phase "${this.selectedPhaseForCampaign?.nom}" ouverte avec succès !`);
        this.closeCampaignModal();
        this.loadMandat();
      },
      error: (err) => {
        this.isSubmittingCampaign = false;
        this.notificationService.showError("Échec de l'ouverture de la campagne d'adhésion.");
        console.error('Failed to open campaign', err);
      }
    });
  }

  closeCampaign(phase: PhaseModel): void {
    this.phaseHttpService.closeRegistrationCampaign(phase.id).subscribe({
      next: () => {
        this.notificationService.showSuccess(`La campagne d'inscription de la phase "${phase.nom}" a été clôturée.`);
        this.loadMandat();
      },
      error: (err) => {
        this.notificationService.showError("Impossible de clôturer la campagne.");
        console.error('Failed to close campaign', err);
      }
    });
  }

  isCampaignOpen(phase: PhaseModel): boolean {
    if (!phase.dateDebutInscription || !phase.dateFinInscription) return false;
    const now = new Date();
    const start = new Date(this.dateArrayToString(phase.dateDebutInscription));
    const end = new Date(this.dateArrayToString(phase.dateFinInscription));
    end.setHours(23, 59, 59);
    return now >= start && now <= end;
  }

  public dateArrayToString(dateArray: [number, number, number] | number[] | null | undefined): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return '';
    const [year, month, day] = dateArray;
    const pad = (num: number) => num < 10 ? '0' + num : '' + num;
    return `${year}-${pad(month)}-${pad(day)}`;
  }
}
