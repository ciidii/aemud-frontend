import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize, of, Subscription, switchMap} from 'rxjs';
import {PhaseHttpService} from '../../services/phase-http.service';
import {UpdatePhaseModel, PhaseModel} from '../../models/phase.model';
import {NotificationService} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-phase-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './phase-edit.component.html',
  styleUrls: ['./phase-edit.component.scss']
})
export class PhaseEditComponent implements OnInit, OnDestroy {
  phaseForm!: FormGroup;
  phaseId: string | null = null;
  periodeMandatId: string | null = null;
  phaseData: PhaseModel | null = null;

  isEditMode = true;
  isLoading = true;
  isSaving = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private phaseHttpService = inject(PhaseHttpService);
  private notificationService = inject(NotificationService);
  private routeSub!: Subscription;

  ngOnInit(): void {
    this.phaseForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      dateDebutInscription: [''],
      dateFinInscription: ['']
    });

    this.routeSub = this.route.paramMap.pipe(
      switchMap(params => {
        this.phaseId = params.get('id');
        if (!this.phaseId) {
          this.notificationService.showError("ID de phase non trouvé.");
          this.router.navigate(['/mandats', 'list']);
          return of(null);
        }
        this.periodeMandatId = this.route.snapshot.queryParamMap.get('periodeMandatId');
        return this.phaseHttpService.getPhaseById(this.phaseId);
      })
    ).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.phaseData = response.data;
          const phase = this.phaseData as any;
          this.phaseForm.patchValue({
            nom: phase.nom,
            dateDebut: this.dateArrayToString(phase.dateDebut),
            dateFin: this.dateArrayToString(phase.dateFin),
            dateDebutInscription: this.dateArrayToString(phase.dateDebutInscription),
            dateFinInscription: this.dateArrayToString(phase.dateFinInscription)
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading phase:", err);
        this.notificationService.showError("Impossible de charger les données de la phase.");
        this.isLoading = false;
      }
    });
  }

  getPhaseStatusBadge(status: string | undefined): { label: string; class: string; icon: string } {
    switch (status) {
      case 'CURRENT':
        return { label: 'En cours', class: 'badge-current', icon: 'bi-play-circle-fill' };
      case 'EXTENDED':
        return { label: 'Prolongée', class: 'badge-extended', icon: 'bi-clock-history' };
      case 'FUTURE':
        return { label: 'À venir', class: 'badge-future', icon: 'bi-calendar-event' };
      case 'PASSED':
      case 'CLOSED':
        return { label: 'Terminée', class: 'badge-closed', icon: 'bi-check-circle-fill' };
      default:
        return { label: status || 'Inconnu', class: 'badge-default', icon: 'bi-dot' };
    }
  }

  onSubmit(): void {
    if (this.phaseForm.invalid || !this.phaseId) {
      this.phaseForm.markAllAsTouched();
      this.notificationService.showError("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    this.isSaving = true;
    const formValue = this.phaseForm.value;

    const payload: UpdatePhaseModel = {
      id: this.phaseId,
      nom: formValue.nom.trim(),
      dateDebut: formValue.dateDebut,
      dateFin: formValue.dateFin,
      dateDebutInscription: formValue.dateDebutInscription || undefined,
      dateFinInscription: formValue.dateFinInscription || undefined
    };

    this.phaseHttpService.updatePhase(this.phaseId, payload).pipe(
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: (updatedPhase) => {
        this.notificationService.showSuccess("La phase a été mise à jour avec succès.");
        this.phaseData = updatedPhase;
        this.navigateBack();
      },
      error: (err) => {
        console.error("Error updating phase:", err);
        this.notificationService.showError("Une erreur est survenue lors de la mise à jour de la phase.");
      }
    });
  }

  navigateBack(): void {
    if (this.periodeMandatId) {
      this.router.navigate(['/mandats', this.periodeMandatId]);
    } else {
      this.router.navigate(['/mandats', 'list']);
    }
  }

  public dateArrayToString(dateArray: [number, number, number] | null | undefined): string {
    if (!dateArray) return '';
    const [year, month, day] = dateArray;
    const pad = (num: number) => num < 10 ? '0' + num : '' + num;
    return `${year}-${pad(month)}-${pad(day)}`;
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
