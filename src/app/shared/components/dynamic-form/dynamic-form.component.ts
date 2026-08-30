import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Subscription} from 'rxjs';
import {
  FormFieldDefinition,
  FormGroupDefinition,
  FormSchema
} from '../../../core/models/form-schema.model';
import {DynamicFieldComponent} from './dynamic-field/dynamic-field.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFieldComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() schema!: FormSchema;
  @Input() initialValues?: Record<string, any>;
  @Input() submitButtonText: string = 'Enregistrer';
  @Input() isSubmitting: boolean = false;
  @Input() isStepper: boolean = true;

  @Output() formSubmit = new EventEmitter<Record<string, any>>();
  @ViewChild('stepperTop') stepperTopRef?: ElementRef;
  @ViewChild('chipsScrollContainer') chipsScrollContainer?: ElementRef;

  form!: FormGroup;
  currentStepIndex: number = 0;
  private valueChangeSubscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] && !changes['schema'].firstChange) {
      this.buildForm();
    }
  }

  ngOnDestroy(): void {
    this.valueChangeSubscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Retourne la liste ordonnée des groupes actuellement visibles.
   */
  get visibleGroups(): FormGroupDefinition[] {
    if (!this.schema || !this.schema.groups) return [];
    return this.schema.groups.filter(g => this.isGroupVisible(g));
  }

  get currentGroup(): FormGroupDefinition | undefined {
    return this.visibleGroups[this.currentStepIndex];
  }

  get nextGroup(): FormGroupDefinition | undefined {
    return this.visibleGroups[this.currentStepIndex + 1];
  }

  get nextGroupTitle(): string | null {
    return this.nextGroup ? this.nextGroup.title : null;
  }

  get isLastStep(): boolean {
    return this.currentStepIndex === this.visibleGroups.length - 1;
  }

  get progressPercentage(): number {
    if (this.visibleGroups.length <= 1) return 100;
    return Math.round(((this.currentStepIndex + 1) / this.visibleGroups.length) * 100);
  }

  /**
   * Construit le FormGroup réactif complet à partir du schéma.
   */
  private buildForm(): void {
    if (!this.schema || !this.schema.groups) return;

    this.valueChangeSubscriptions.forEach(sub => sub.unsubscribe());
    this.valueChangeSubscriptions = [];

    const groupControls: Record<string, FormControl> = {};

    this.schema.groups.forEach(group => {
      group.fields.forEach(field => {
        const initialVal = this.getInitialValue(field);
        const validators = this.buildValidators(field);
        groupControls[field.key] = new FormControl(initialVal, validators);
      });
    });

    this.form = this.fb.group(groupControls);

    // Écoute des changements pour les champs conditionnels (ex: isStudent)
    this.setupConditionalVisibilityListeners();

    // Initialisation de l'état des validateurs conditionnels
    this.updateConditionalValidators();

    // Reset step index if out of bounds
    if (this.currentStepIndex >= this.visibleGroups.length) {
      this.currentStepIndex = Math.max(0, this.visibleGroups.length - 1);
    }
  }

  private getInitialValue(field: FormFieldDefinition): any {
    if (this.initialValues && this.initialValues[field.key] !== undefined) {
      return this.initialValues[field.key];
    }
    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      return field.defaultValue;
    }
    if (field.type === 'BOOLEAN') {
      return false;
    }
    if (field.type === 'MULTI_SELECT') {
      return [];
    }
    return '';
  }

  private isFieldMandatory(field: FormFieldDefinition): boolean {
    return field.isRequired ?? field.required ?? false;
  }

  private isGroupActive(group: FormGroupDefinition): boolean {
    return group.isActive ?? group.active ?? true;
  }

  private buildValidators(field: FormFieldDefinition): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (this.isFieldMandatory(field)) {
      if (field.type === 'BOOLEAN') {
        // Un boolean n'est pas soumis à required standard
      } else {
        validators.push(Validators.required);
      }
    }

    if (field.key === 'email') {
      validators.push(Validators.email);
    }

    if (field.validation) {
      if (field.validation.minLength != null && field.validation.minLength > 0) {
        validators.push(Validators.minLength(field.validation.minLength));
      }
      if (field.validation.maxLength != null && field.validation.maxLength > 0) {
        validators.push(Validators.maxLength(field.validation.maxLength));
      }
      if (field.validation.min != null) {
        validators.push(Validators.min(field.validation.min));
      }
      if (field.validation.max != null) {
        validators.push(Validators.max(field.validation.max));
      }
      if (field.validation.pattern && field.validation.pattern.trim().length > 0) {
        validators.push(Validators.pattern(field.validation.pattern));
      }
    }

    return validators;
  }

  private setupConditionalVisibilityListeners(): void {
    const observedKeys = new Set<string>();

    this.schema.groups.forEach(group => {
      if (group.visibilityCondition?.dependsOn) {
        observedKeys.add(group.visibilityCondition.dependsOn);
      }
    });

    observedKeys.forEach(key => {
      const control = this.form.get(key);
      if (control) {
        const sub = control.valueChanges.subscribe(() => {
          this.updateConditionalValidators();
          if (this.currentStepIndex >= this.visibleGroups.length) {
            this.currentStepIndex = Math.max(0, this.visibleGroups.length - 1);
          }
        });
        this.valueChangeSubscriptions.push(sub);
      }
    });
  }

  /**
   * Active ou désactive dynamiquement les validateurs selon la visibilité du groupe.
   */
  private updateConditionalValidators(): void {
    if (!this.schema || !this.form) return;

    this.schema.groups.forEach(group => {
      const isVisible = this.isGroupVisible(group);
      group.fields.forEach(field => {
        const control = this.form.get(field.key);
        if (!control) return;

        if (isVisible) {
          control.setValidators(this.buildValidators(field));
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity({emitEvent: false});
      });
    });
  }

  /**
   * Détermine si un groupe est actuellement visible.
   */
  isGroupVisible(group: FormGroupDefinition): boolean {
    if (!this.isGroupActive(group)) return false;
    if (!group.visibilityCondition) return true;

    const dependentControl = this.form?.get(group.visibilityCondition.dependsOn);
    if (!dependentControl) return true;

    return dependentControl.value === group.visibilityCondition.equals;
  }

  // ================= NAVIGATION DANS LE STEPPER =================

  isCurrentStepValid(): boolean {
    if (!this.currentGroup || !this.form) return true;
    for (const field of this.currentGroup.fields) {
      const control = this.form.get(field.key);
      if (control && control.invalid) {
        return false;
      }
    }
    return true;
  }

  isStepCompleted(index: number): boolean {
    if (index >= this.visibleGroups.length) return false;
    const group = this.visibleGroups[index];
    if (!group || !this.form) return false;

    return group.fields.every(f => {
      const ctrl = this.form.get(f.key);
      return !ctrl || ctrl.valid;
    });
  }

  goToStep(targetIndex: number): void {
    if (targetIndex < 0 || targetIndex >= this.visibleGroups.length) return;

    // Si on recule, c'est toujours autorisé
    if (targetIndex < this.currentStepIndex) {
      this.currentStepIndex = targetIndex;
      this.scrollToTop();
      return;
    }

    // Si on avance, vérifier que l'étape courante est valide
    if (this.validateCurrentStep()) {
      this.currentStepIndex = targetIndex;
      this.scrollToTop();
    }
  }

  nextStep(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.currentStepIndex < this.visibleGroups.length - 1) {
      this.currentStepIndex++;
      this.scrollToTop();
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.scrollToTop();
    }
  }

  private validateCurrentStep(): boolean {
    if (!this.currentGroup || !this.form) return true;

    let hasErrors = false;
    this.currentGroup.fields.forEach(field => {
      const control = this.form.get(field.key);
      if (control) {
        control.markAsTouched();
        control.markAsDirty();
        if (control.invalid) {
          hasErrors = true;
        }
      }
    });

    return !hasErrors;
  }

  private scrollToTop(): void {
    if (this.stepperTopRef) {
      this.stepperTopRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    this.scrollActiveChipIntoView();
  }

  private scrollActiveChipIntoView(): void {
    setTimeout(() => {
      if (this.chipsScrollContainer) {
        const container = this.chipsScrollContainer.nativeElement as HTMLElement;
        const activeChip = container.querySelector('.active') as HTMLElement;
        if (activeChip) {
          const scrollLeft = activeChip.offsetLeft - (container.offsetWidth / 2) + (activeChip.offsetWidth / 2);
          container.scrollTo({left: Math.max(0, scrollLeft), behavior: 'smooth'});
        }
      }
    }, 50);
  }

  /**
   * Traitement et soumission finale du formulaire.
   */
  onSubmit(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.form.invalid) {
      this.markAllAsTouched();
      // Trouver la première étape invalide et s'y positionner
      const firstInvalidIndex = this.visibleGroups.findIndex(g => !this.isStepCompleted(this.visibleGroups.indexOf(g)));
      if (firstInvalidIndex !== -1) {
        this.currentStepIndex = firstInvalidIndex;
        this.scrollToTop();
      }
      return;
    }

    const rawValues = this.form.value;
    const corePresetPayload: Record<string, any> = {};
    const dynamicAttributes: Record<string, any> = {};

    this.schema.groups.forEach(group => {
      if (this.isGroupVisible(group)) {
        group.fields.forEach(field => {
          const val = rawValues[field.key];
          if (field.category === 'CUSTOM') {
            dynamicAttributes[field.key] = val;
          } else {
            corePresetPayload[field.key] = val;
          }
        });
      }
    });

    const finalPayload = {
      ...corePresetPayload,
      dynamicAttributes
    };

    this.formSubmit.emit(finalPayload);
  }

  private markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
