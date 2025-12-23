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
import {finalize, Subscription} from "rxjs";
import {PhaseTimelineComponent, TimelinePhase} from '../../components/phase-timeline/phase-timeline.component';
import {PhaseFormItemComponent} from '../../components/phase-form-item/phase-form-item.component';
import {PeriodeMandatHttpService} from '../../services/periode-mandat-http.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {CreatePeriodeMandatModel} from '../../models/CreatePeriodeMandatModel';
import {CreatePhaseModel} from '../../models/CreatePhaseModel';


// ----------------------------------------------------
// ✔ PHASE FORM GROUP INTERFACE (CORRECT)
// ----------------------------------------------------
export interface PhaseFormGroup {
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
  estActive: FormControl<boolean | null>;
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

  if (!dateDebutMandat || !dateFinMandat) return null;

  const mandateStart = new Date(dateDebutMandat);
  const mandateEnd = new Date(dateFinMandat);

  if (mandateStart > mandateEnd)
    return {mandateDateOrder: true};

  if (phases.length === 0)
    return null;

  const items = phases.controls.map(p => p.value);

  // Tri par date
  const sorted = [...items].sort(
    (a, b) => new Date(a.dateDebut!).getTime() - new Date(b.dateDebut!).getTime()
  );

  // Vérification de continuité
  let expected = mandateStart;

  for (let i = 0; i < sorted.length; i++) {
    const start = new Date(sorted[i].dateDebut!);
    const end = new Date(sorted[i].dateFin!);

    if (start > end)
      return {phaseDateOrder: true};

    if (start < expected)
      return {phaseOverlap: true};

    if (start > expected)
      return {phaseGap: true};

    if (end > mandateEnd)
      return {phaseOutsideMandate: true};

    // Next expected start = end + 1
    expected = new Date(end);
    expected.setDate(expected.getDate() + 1);
  }

  if (expected.getTime() - 1 !== mandateEnd.getTime())
    return {phaseGap: true};

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
      estActive: this.fb.control<boolean | null>(true),
      calculatePhasesAutomatically: this.fb.control<boolean | null>(true),
      numberOfPhases: this.fb.control<number | null>(null),
      phases: this.fb.array<FormGroup<PhaseFormGroup>>([])
    }, {validators: phasesValidator});


    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.periodeMandatId = params.get('id');
      if (this.periodeMandatId) {
        console.log("Editing Periode de Mandat:", this.periodeMandatId);
        // TODO: Fetch existing periode de mandat data
      }
    });
  }

  addPhase(): void {
    const phase = this.fb.group<PhaseFormGroup>({
      nom: this.fb.control<string | null>(null, Validators.required),
      dateDebut: this.fb.control<string | null>(null, Validators.required),
      dateFin: this.fb.control<string | null>(null, Validators.required),
      dateDebutInscription: this.fb.control<string | null>(null),
      dateFinInscription: this.fb.control<string | null>(null)
    });
    this.phasesFormArray.push(phase);
  }

  removePhase(index: number): void {
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

    const periodeMandatPayload: CreatePeriodeMandatModel = {
      nom: formValue.nom!,
      dateDebut: formValue.dateDebut!,
      dateFin: formValue.dateFin!,
      estActive: formValue.estActive!,
      calculatePhasesAutomatically: formValue.calculatePhasesAutomatically!,
      numberOfPhases: formValue.calculatePhasesAutomatically ? formValue.numberOfPhases : undefined,
      phases: !formValue.calculatePhasesAutomatically ? formValue.phases as CreatePhaseModel[] : undefined
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


  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
