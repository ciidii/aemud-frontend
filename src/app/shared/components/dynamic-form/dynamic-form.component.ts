import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
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

  @Output() formSubmit = new EventEmitter<Record<string, any>>();

  form!: FormGroup;
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

  private buildValidators(field: FormFieldDefinition): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.isRequired) {
      if (field.type === 'BOOLEAN') {
        // Un boolean n'est pas soumis à required standard
      } else {
        validators.push(Validators.required);
      }
    }

    if (field.validation) {
      if (field.validation.minLength !== undefined) {
        validators.push(Validators.minLength(field.validation.minLength));
      }
      if (field.validation.maxLength !== undefined) {
        validators.push(Validators.maxLength(field.validation.maxLength));
      }
      if (field.validation.min !== undefined) {
        validators.push(Validators.min(field.validation.min));
      }
      if (field.validation.max !== undefined) {
        validators.push(Validators.max(field.validation.max));
      }
      if (field.validation.pattern) {
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
    if (!group.isActive) return false;
    if (!group.visibilityCondition) return true;

    const dependentControl = this.form?.get(group.visibilityCondition.dependsOn);
    if (!dependentControl) return true;

    return dependentControl.value === group.visibilityCondition.equals;
  }

  /**
   * Traitement et soumission du formulaire.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
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
