import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, finalize, Subscription, of} from "rxjs";
import {PhaseTimelineComponent, TimelinePhase} from '../../components/phase-timeline/phase-timeline.component';
import {PhaseFormItemComponent} from '../../components/phase-form-item/phase-form-item.component';
import {PeriodeMandatHttpService} from '../../services/periode-mandat-http.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {CreatePeriodeMandatModel} from '../../models/CreatePeriodeMandatModel';
import {CreatePhaseModel} from '../../models/CreatePhaseModel';
import {PeriodeMandatDto} from '../../models/periode-mandat.model';
import {UpdatePhaseModel} from "../../models/UpdatePhaseModel";

// ----------------------------------------------------
// ✔ PHASE FORM GROUP INTERFACE
// ----------------------------------------------------
export interface PhaseFormGroup {
  id: FormControl<string | null>; // Can be null for new phases
  nom: FormControl<string | null>;
  dateDebut: FormControl<string | null>;
  dateFin: FormControl<string | null>;
  dateDebutInscription: FormControl<string | null>;
  dateFinInscription: FormControl<string | null>;
}


// ----------------------------------------------------
// ✔ PERIODE MANDAT FORM INTERFACE
// ----------------------------------------------------
export interface PeriodeMandatForm {
  nom: FormControl<string | null>;
  dateDebut: FormControl<string | null>;
  dateFin: FormControl<string | null>;
  estActif: FormControl<boolean | null>;
  calculatePhasesAutomatically: FormControl<boolean | null>;
  numberOfPhases: FormControl<number | null>;
  phases: FormArray<FormGroup<PhaseFormGroup>>;
}


// ----------------------------------------------------
const phasesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup<PeriodeMandatForm>;

  const dateDebutMandat = formGroup.controls.dateDebut.value;
  const dateFinMandat = formGroup.controls.dateFin.value;
  const phases = formGroup.controls.phases;

  if (!dateDebutMandat || !dateFinMandat || phases.length === 0) {
    return null;
  }

  const normalizeDate = (d: Date): Date => {
    d.setUTCHours(0, 0, 0, 0);
    return d;
  };

  const mandateStart = normalizeDate(new Date(dateDebutMandat));
  const mandateEnd = normalizeDate(new Date(dateFinMandat));

  if (mandateStart.getTime() > mandateEnd.getTime()) {
    return {mandateDateOrder: true};
  }

  const items = phases.controls.map(p => p.value);
  const sorted = [...items].sort((a, b) => new Date(a.dateDebut!).getTime() - new Date(b.dateDebut!).getTime());

  // Check 1: First phase must start exactly on mandate start date
  const firstPhaseStart = normalizeDate(new Date(sorted[0].dateDebut!));
  if (firstPhaseStart.getTime() !== mandateStart.getTime()) {
    return {phaseGap: true, message: 'La première phase doit commencer à la date de début de la période.'};
  }

  // Check 2: Last phase must end exactly on mandate end date
  const lastPhaseEnd = normalizeDate(new Date(sorted[sorted.length - 1].dateFin!));
  if (lastPhaseEnd.getTime() !== mandateEnd.getTime()) {
    return {phaseGap: true, message: 'La dernière phase doit se terminer à la date de fin de la période.'};
  }

  // Check 3: All phases must be contiguous, without gaps or overlaps, and within the mandate period
  for (let i = 0; i < sorted.length; i++) {
    const start = normalizeDate(new Date(sorted[i].dateDebut!));
    const end = normalizeDate(new Date(sorted[i].dateFin!));

    if (start.getTime() > end.getTime()) {
      return {phaseDateOrder: true, message: `La phase "${sorted[i].nom}" a une date de début après sa date de fin.`};
    }

    if (i < sorted.length - 1) {
      const nextStart = normalizeDate(new Date(sorted[i + 1].dateDebut!));
      const expectedNextStart = new Date(end);
      expectedNextStart.setUTCDate(expectedNextStart.getUTCDate() + 1);

      if (nextStart.getTime() !== expectedNextStart.getTime()) {
        return {phaseOverlapOrGap: true, message: 'Les phases doivent être continues et ne pas se chevaucher.'};
      }
    }
  }

  return null;
};


@Component({
  selector: 'app-periode-mandat-add-edit',
  templateUrl: './periode-mandat-add-edit.component.html',
  styleUrl: './periode-mandat-add-edit.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PhaseTimelineComponent, PhaseFormItemComponent]
})
export class PeriodeMandatAddEditComponent implements OnInit, OnDestroy {

  periodeMandatForm!: FormGroup<PeriodeMandatForm>;
  periodeMandatId: string | null = null;
  isLoading = false;

  private deletedPhaseIds: string[] = [];
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private periodeMandatHttpService = inject(PeriodeMandatHttpService);
  private notificationService = inject(NotificationService);

  private routeSubscription!: Subscription;


  constructor() {
  }

  get phasesFormArray(): FormArray<FormGroup<PhaseFormGroup>> {
    return this.periodeMandatForm.controls.phases;
  }

  get timelinePhases(): TimelinePhase[] {

    return this.phasesFormArray.controls.map((c, i) => {
      const value = c.value;

      return {
        nom: value.nom ?? `Phase ${i + 1}`,
        dateDebut: value.dateDebut ?? "",
        dateFin: value.dateFin ?? "",
        isValid: c.valid,
        isOverlapping: false,
        isOutsideMandate: false,
        isDateOrderInvalid: false
      };
    });
  }

  ngOnInit(): void {

    this.periodeMandatForm = this.fb.group<PeriodeMandatForm>({
      nom: this.fb.control<string | null>(null, Validators.required),
      dateDebut: this.fb.control<string | null>(null, Validators.required),
      dateFin: this.fb.control<string | null>(null, Validators.required),
      estActif: this.fb.control<boolean | null>(true),
      calculatePhasesAutomatically: this.fb.control<boolean | null>(true),
      numberOfPhases: this.fb.control<number | null>(null),
      phases: this.fb.array<FormGroup<PhaseFormGroup>>([])
    }, {validators: phasesValidator});


    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.periodeMandatId = params.get('id');
      if (this.periodeMandatId) {
        this.loadPeriodeMandatForEdit(this.periodeMandatId);
      }
    });
  }

  addPhase(): void {
    const phase = this.fb.group<PhaseFormGroup>({
      id: this.fb.control<string | null>(null), // New phases have null id
      nom: this.fb.control<string | null>(null, Validators.required),
      dateDebut: this.fb.control<string | null>(null, Validators.required),
      dateFin: this.fb.control<string | null>(null, Validators.required),
      dateDebutInscription: this.fb.control<string | null>(null),
      dateFinInscription: this.fb.control<string | null>(null)
    });
    this.phasesFormArray.push(phase);
  }

  removePhase(index: number): void {
    const phaseControl = this.phasesFormArray.at(index);
    const phaseId = phaseControl.get('id')?.value;

    if (phaseId) {
      this.deletedPhaseIds.push(phaseId);
    }

    this.phasesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.periodeMandatForm.invalid) {
      this.periodeMandatForm.markAllAsTouched();
      this.notificationService.showError('Veuillez corriger les erreurs dans le formulaire.');
      console.log("INVALID FORM", this.periodeMandatForm.errors);
      return;
    }

    this.isLoading = true;
    const formValue = this.periodeMandatForm.getRawValue();

    // Differentiate between create, update, and delete for phases
    const createPhases: CreatePhaseModel[] = [];
    const updatePhases: UpdatePhaseModel[] = [];

    if (!formValue.calculatePhasesAutomatically) {
      formValue.phases.forEach(phase => {
        if (phase.id) {
          // It's an existing phase, so it's an update
          updatePhases.push({
            id: phase.id,
            nom: phase.nom!,
            dateDebut: phase.dateDebut!,
            dateFin: phase.dateFin!,
            dateDebutInscription: phase.dateDebutInscription || undefined,
            dateFinInscription: phase.dateFinInscription || undefined,
          });
        } else {
          // No ID, so it's a new phase
          createPhases.push({
            nom: phase.nom!,
            dateDebut: phase.dateDebut!,
            dateFin: phase.dateFin!,
            dateDebutInscription: phase.dateDebutInscription || undefined,
            dateFinInscription: phase.dateFinInscription || undefined,
          });
        }
      });
    }

    const periodeMandatPayload: CreatePeriodeMandatModel = {
      nom: formValue.nom!,
      dateDebut: formValue.dateDebut!,
      dateFin: formValue.dateFin!,
      estActif: formValue.estActif!,
      calculatePhasesAutomatically: formValue.calculatePhasesAutomatically!,
      numberOfPhases: formValue.calculatePhasesAutomatically ? formValue.numberOfPhases : undefined,
      createPhases: createPhases.length > 0 ? createPhases : undefined,
      updatePhases: updatePhases.length > 0 ? updatePhases : undefined,
      deletePhaseIds: this.deletedPhaseIds.length > 0 ? this.deletedPhaseIds : undefined,
    };

    const action$ = this.periodeMandatId
      ? this.periodeMandatHttpService.updatePeriodeMandat(this.periodeMandatId, periodeMandatPayload)
      : this.periodeMandatHttpService.createPeriodeMandat(periodeMandatPayload);

    action$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        const action = this.periodeMandatId ? 'mise à jour' : 'créée';
        this.notificationService.showSuccess(`La période de mandat a été ${action} avec succès.`);
        this.router.navigate(['/periode-mandats', 'list']); // Corrected navigation
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Une erreur est survenue lors de la sauvegarde de la période de mandat.');
      }
    });
  }

  private loadPeriodeMandatForEdit(id: string): void {
    this.isLoading = true;
    this.periodeMandatHttpService.getPeriodeMandatById(id).pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Error fetching periode mandat for edit:', err);
        this.notificationService.showError('Erreur lors du chargement de la période de mandat.');
        this.router.navigate(['/periode-mandats', 'list']);
        return of(null);
      })
    ).subscribe(response => {
      if (response && response.data) {
        const periodeMandat = response.data;
        this.periodeMandatForm.patchValue({
          nom: periodeMandat.nom,
          dateDebut: this.dateArrayToString(periodeMandat.dateDebut),
          dateFin: this.dateArrayToString(periodeMandat.dateFin),
          estActif: periodeMandat.estActif,
          calculatePhasesAutomatically: false, // Force manual mode for editing phases
          numberOfPhases: null
        });

        // Clear existing phases before populating
        this.phasesFormArray.clear();
        this.deletedPhaseIds = []; // Reset deleted IDs on load

        periodeMandat.phases.forEach(phase => {
          this.phasesFormArray.push(this.fb.group<PhaseFormGroup>({
            id: this.fb.control<string | null>(phase.id), // Populate the ID
            nom: this.fb.control<string | null>(phase.nom, Validators.required),
            dateDebut: this.fb.control<string | null>(this.dateArrayToString(phase.dateDebut), Validators.required),
            dateFin: this.fb.control<string | null>(this.dateArrayToString(phase.dateFin), Validators.required),
            dateDebutInscription: phase.dateDebutInscription ? this.fb.control<string | null>(this.dateArrayToString(phase.dateDebutInscription)) : this.fb.control<string | null>(null),
            dateFinInscription: phase.dateFinInscription ? this.fb.control<string | null>(this.dateArrayToString(phase.dateFinInscription)) : this.fb.control<string | null>(null)
          }));
        });
      }
    });
  }

  private dateArrayToString(dateArray: [number, number, number] | null | undefined): string {
    if (!dateArray) return '';
    const [year, month, day] = dateArray;
    const pad = (num: number) => num < 10 ? '0' + num : '' + num;
    return `${year}-${pad(month)}-${pad(day)}`;
  }


  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
