import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, finalize, of, Subscription, switchMap} from 'rxjs';
import {NotificationService} from '../../../../core/services/notification.service';
import {PhaseHttpService} from '../../periode-mandat/services/phase-http.service';
import {UpdatePhaseModel} from "../../periode-mandat/models/UpdatePhaseModel";

@Component({
  selector: 'app-phase-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './phase-edit.component.html',
  styleUrls: ['./phase-edit.component.scss']
})
export class PhaseEditComponent implements OnInit, OnDestroy {
  phaseForm!: FormGroup;
  phaseId: string | null = null;
  periodeMandatId: string | null = null; // To navigate back
  initialPhaseName: string = '';

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
      nom: ['', Validators.required],
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
          this.router.navigate(['/periode-mandats/list']);
          return of(null);
        }
        this.periodeMandatId = this.route.snapshot.queryParamMap.get('periodeMandatId');
        return this.phaseHttpService.getPhaseById(this.phaseId);
      })
    ).subscribe(response => {
      if (response && response.data) {
        const phase = response.data;
        this.initialPhaseName = phase.nom;
        this.phaseForm.patchValue({
          nom: phase.nom,
          dateDebut: this.dateArrayToString(phase.dateDebut),
          dateFin: this.dateArrayToString(phase.dateFin),
          dateDebutInscription: this.dateArrayToString(phase.dateDebutInscription),
          dateFinInscription: this.dateArrayToString(phase.dateFinInscription)
        });
      }
      this.isLoading = false;
    });
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
      nom: formValue.nom,
      dateDebut: formValue.dateDebut,
      dateFin: formValue.dateFin,
      dateDebutInscription: formValue.dateDebutInscription || undefined,
      dateFinInscription: formValue.dateFinInscription || undefined
    };

    this.phaseHttpService.updatePhase(this.phaseId, payload).pipe(
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess("La phase a été mise à jour avec succès.");
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
      this.router.navigate(['/periode-mandats', this.periodeMandatId]);
    } else {
      this.router.navigate(['/periode-mandats', 'list']);
    }
  }

  private dateArrayToString(dateArray: [number, number, number] | null | undefined): string {
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
