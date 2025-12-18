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
import {MandatHttpService} from '../../services/mandat-http.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {CreateMandatModel} from '../../models/CreateMandatModel';
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
// ✔ MANDAT FORM INTERFACE (CORRECT)
// ----------------------------------------------------
export interface MandatForm {
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
  const formGroup = control as FormGroup<MandatForm>;

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
  selector: 'app-mandat-add-edit',
  templateUrl: './mandat-add-edit.component.html',
  styleUrl: './mandat-add-edit.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PhaseTimelineComponent, PhaseFormItemComponent]
})
export class MandatAddEditComponent implements OnInit, OnDestroy {

  mandatForm!: FormGroup<MandatForm>;
  mandatId: string | null = null;
  isLoading = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mandatHttpService = inject(MandatHttpService);
  private notificationService = inject(NotificationService);

  private routeSubscription!: Subscription;


  constructor() {
  }

  get phasesFormArray(): FormArray<FormGroup<PhaseFormGroup>> {
    return this.mandatForm.controls.phases;
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

    this.mandatForm = this.fb.group<MandatForm>({
      nom: this.fb.control<string | null>(null, Validators.required),
      dateDebut: this.fb.control<string | null>(null, Validators.required),
      dateFin: this.fb.control<string | null>(null, Validators.required),
      estActive: this.fb.control<boolean | null>(true),
      calculatePhasesAutomatically: this.fb.control<boolean | null>(true),
      numberOfPhases: this.fb.control<number | null>(null),
      phases: this.fb.array<FormGroup<PhaseFormGroup>>([])
    }, {validators: phasesValidator});


    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.mandatId = params.get('id');
      if (this.mandatId) {
        console.log("Editing Mandat:", this.mandatId);
        // TODO: Fetch existing mandate data
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
    if (this.mandatForm.invalid) {
      this.mandatForm.markAllAsTouched();
      this.notificationService.showError('Veuillez corriger les erreurs dans le formulaire.');
      console.log("INVALID FORM", this.mandatForm.errors);
      return;
    }

    this.isLoading = true;
    const formValue = this.mandatForm.getRawValue();

    const mandatPayload: CreateMandatModel = {
      nom: formValue.nom!,
      dateDebut: formValue.dateDebut!,
      dateFin: formValue.dateFin!,
      estActive: formValue.estActive!,
      calculatePhasesAutomatically: formValue.calculatePhasesAutomatically!,
      numberOfPhases: formValue.calculatePhasesAutomatically ? formValue.numberOfPhases : undefined,
      phases: !formValue.calculatePhasesAutomatically ? formValue.phases as CreatePhaseModel[] : undefined
    };

    const action$ = this.mandatId
      ? this.mandatHttpService.updateMandat(this.mandatId, mandatPayload)
      : this.mandatHttpService.createMandat(mandatPayload);

    action$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        const action = this.mandatId ? 'mis à jour' : 'créé';
        this.notificationService.showSuccess(`Le mandat a été ${action} avec succès.`);
        this.router.navigate(['/mandats', 'list']); // Corrected navigation
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Une erreur est survenue lors de la sauvegarde du mandat.');
      }
    });
  }


  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
