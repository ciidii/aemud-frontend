import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AbstractControl} from "@angular/forms";

@Component({
  selector: 'app-validation-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent {

  @Input() control: AbstractControl | null = null;

  private readonly errorMessages: { [key: string]: (params: any) => string } = {
    'required': () => `Ce champ est requis`,
    'email': () => `L\'adresse e-mail est invalide`,
    'minlength': (params) => `Ce champ doit contenir au moins ${params.requiredLength} caractères`,
    'maxlength': (params) => `Ce champ ne peut pas dépasser ${params.requiredLength} caractères`,
  };

  shouldShowErrors(): boolean {
    return this.control !== null && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    const errors = this.control?.errors;
    if (!errors) {
      return [];
    }

    return Object.keys(errors).map(err =>
      this.errorMessages[err] ? this.errorMessages[err](errors[err]) : 'Erreur inconnue'
    );
  }
}
