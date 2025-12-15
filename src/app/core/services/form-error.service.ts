import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { NotificationService } from './notification.service';

// Describes the structure of a single field error from the API
interface ApiErrorDetail {
  field: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormErrorService {
  private notificationService = inject(NotificationService);

  /**
   * Parses an HttpErrorResponse and applies field-specific errors to a FormGroup.
   * Also displays a global error message using the NotificationService.
   * @param errorResponse The HttpErrorResponse received from the API.
   * @param form The FormGroup to apply the errors to.
   */
  public handleServerErrors(
    errorResponse: HttpErrorResponse,
    form: FormGroup
  ): void {
    // Default global message if none is provided by the API
    const globalErrorMessage = errorResponse.error?.message || 'Une erreur est survenue. Veuillez vérifier les champs du formulaire.';
    this.notificationService.showError(globalErrorMessage, 'Échec de la validation');

    // Check if the detailed errors array exists
    const errors: ApiErrorDetail[] = errorResponse.error?.errors;
    if (errors && Array.isArray(errors)) {
      // Apply each error to its corresponding FormControl
      errors.forEach(err => {
        const control = form.get(err.field);
        if (control) {
          // Using setErrors will overwrite other validation errors,
          // which is often the desired behavior for server-side validation.
          control.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
