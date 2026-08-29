import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FormFieldDefinition} from '../../../../core/models/form-schema.model';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss']
})
export class DynamicFieldComponent {
  @Input() field!: FormFieldDefinition;
  @Input() formGroup!: FormGroup;

  get control(): FormControl {
    return this.formGroup.get(this.field.key) as FormControl;
  }

  get isFieldRequired(): boolean {
    return this.field.isRequired ?? this.field.required ?? false;
  }

  get isInvalid(): boolean {
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }

  get errorMessage(): string {
    if (!this.control || !this.control.errors) return '';

    if (this.field.validation?.customErrorMessage) {
      return this.field.validation.customErrorMessage;
    }

    if (this.control.errors['required']) {
      return `Le champ "${this.field.label}" est obligatoire.`;
    }
    if (this.control.errors['email'] || this.control.errors['pattern']) {
      return `Veuillez saisir un format valide pour "${this.field.label}".`;
    }
    if (this.control.errors['minlength']) {
      return `Minimum ${this.control.errors['minlength'].requiredLength} caractères requis.`;
    }
    if (this.control.errors['maxlength']) {
      return `Maximum ${this.control.errors['maxlength'].requiredLength} caractères autorisés.`;
    }
    if (this.control.errors['min']) {
      return `La valeur minimale autorisée est ${this.control.errors['min'].min}.`;
    }
    if (this.control.errors['max']) {
      return `La valeur maximale autorisée est ${this.control.errors['max'].max}.`;
    }

    return 'Valeur invalide.';
  }

  isMultiSelectOptionSelected(option: string): boolean {
    const currentValues: string[] = this.control?.value || [];
    return currentValues.includes(option);
  }

  toggleMultiSelectOption(option: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentValues: string[] = [...(this.control?.value || [])];

    if (isChecked && !currentValues.includes(option)) {
      currentValues.push(option);
    } else if (!isChecked && currentValues.includes(option)) {
      const index = currentValues.indexOf(option);
      currentValues.splice(index, 1);
    }

    this.control.setValue(currentValues);
    this.control.markAsDirty();
    this.control.markAsTouched();
  }
}
