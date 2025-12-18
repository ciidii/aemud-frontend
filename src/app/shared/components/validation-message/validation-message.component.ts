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

  private readonly errorMessages: Record<string, (params: any) => string> = {
    'required': () => `Ce champ est requis`,
    'email': () => `L\'adresse e-mail est invalide`,
    'minlength': (params) => `Ce champ doit contenir au moins ${params.requiredLength} caractères`,
    'maxlength': (params) => `Ce champ ne peut pas dépasser ${params.requiredLength} caractères`,
    'passwordMismatch': () => `Les mots de passe ne correspondent pas`,
  };

  shouldShowErrors(): boolean {
    return this.control !== null && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    const errors = this.control?.errors;
    if (!errors) {
      return [];
    }

    return Object.keys(errors).map(key => {
      if (key === 'serverError') {
        // For server errors, the message is the value of the error object.
        return errors[key];
      }
      // For standard client-side errors, look up the message in the map.
      if (this.errorMessages[key]) {
        return this.errorMessages[key](errors[key]);
      }
      // Fallback for any other unknown error.
      return 'Erreur de validation inconnue.';
    });
  }
}
