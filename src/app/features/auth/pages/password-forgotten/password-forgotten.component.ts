import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../../user/services/user.service";
import {catchError, throwError} from "rxjs";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-password-forgotten',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './password-forgotten.component.html',
  styleUrls: ['./password-forgotten.component.scss']
})
export class PasswordForgottenComponent {
  formGroup: FormGroup;
  isSubmitted = false;
  currentStep: 'email' | 'code' | 'password' = 'email';
  completedSteps = new Set<'email' | 'code' | 'password'>();
  isLoading = false;
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder)
  private router = inject(Router)

  constructor() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', []],
      password: ['', []],
      confirmPassword: ['', []]
    });

    this.updateValidatorsForCurrentStep();
  }

  isStepComplete(step: 'email' | 'code' | 'password'): boolean {
    return this.completedSteps.has(step);
  }

  editEmail(): void {
    this.currentStep = 'email';
    this.completedSteps.delete('email');
    this.completedSteps.delete('code');
    this.completedSteps.delete('password');
    this.formGroup.controls['code'].reset();
    this.formGroup.controls['password'].reset();
    this.formGroup.controls['confirmPassword'].reset();
    this.updateValidatorsForCurrentStep();
  }

  onSubmit(): void {
    this.isSubmitted = true;

    this.updateValidatorsForCurrentStep();

    if (this.currentStep === 'email') {
      this.formGroup.controls['email'].markAsTouched();
    } else if (this.currentStep === 'code') {
      this.formGroup.controls['code'].markAsTouched();
    } else if (this.currentStep === 'password') {
      this.formGroup.controls['password'].markAsTouched();
      this.formGroup.controls['confirmPassword'].markAsTouched();
      if (this.formGroup.value.password !== this.formGroup.value.confirmPassword) {
        this.formGroup.controls['confirmPassword'].setErrors({passwordsMismatch: true});
      } else {
        if (this.formGroup.controls['confirmPassword'].hasError('passwordsMismatch')) {
          const errors = {...this.formGroup.controls['confirmPassword'].errors};
          delete errors['passwordsMismatch'];
          this.formGroup.controls['confirmPassword'].setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }


    if (this.formGroup.invalid) {
      this.notificationService.showError('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    this.isLoading = true;

    const finaliseRequest = () => {
      this.isLoading = false;
      this.isSubmitted = false;
    }

    switch (this.currentStep) {
      case 'email':
        this.userService.checkForgottenPasswordEmail(this.formGroup.controls['email'].value).pipe(
          catchError(err => {
            if (err.status === 404) {
              this.notificationService.showError('Cette adresse e-mail n\'existe pas dans nos dossiers.');
            } else {
              this.notificationService.showError('Une erreur est survenue. Veuillez réessayer.');
            }
            return throwError(() => new Error('API Error'));
          })
        ).subscribe({
          next: () => {
            this.completedSteps.add('email');
            this.currentStep = 'code';
            this.notificationService.showSuccess('Un code de réinitialisation a été envoyé à votre adresse e-mail.');
            this.updateValidatorsForCurrentStep();
            finaliseRequest();
          },
          error: () => {
            finaliseRequest();
          }
        });
        break;

      case 'code':
        this.userService.checkForgottenPasswordToken(this.formGroup.controls['email'].value, this.formGroup.controls['code'].value).pipe(
          catchError(err => {
            if (err.status === 400 || err.status === 401) {
              this.notificationService.showError('Code de réinitialisation invalide ou expiré.');
            } else {
              this.notificationService.showError('Une erreur est survenue lors de la vérification du code.');
            }
            return throwError(() => new Error('API Error'));
          })
        ).subscribe({
          next: () => {
            this.completedSteps.add('code');
            this.currentStep = 'password';
            this.notificationService.showSuccess('Code vérifié avec succès. Vous pouvez maintenant définir votre nouveau mot de passe.');
            this.updateValidatorsForCurrentStep();
            finaliseRequest();
          },
          error: () => {
            finaliseRequest();
          }
        });
        break;

      case 'password':
        this.userService.resetForgottenPassword(this.formGroup.controls['password'].value, this.formGroup.controls['confirmPassword'].value, this.formGroup.controls['email'].value, this.formGroup.controls['code'].value).pipe(
          catchError(err => {
            this.notificationService.showError('Échec de la réinitialisation du mot de passe.');
            return throwError(() => new Error('API Error'));
          })
        ).subscribe({
          next: () => {
            this.completedSteps.add('password');
            this.notificationService.showSuccess('Votre mot de passe a été réinitialisé avec succès ! Vous allez être redirigé.');
            finaliseRequest();
            setTimeout(() => {
              this.router.navigate(['/auth', 'login']);
            }, 1000);
          },
          error: () => {
            finaliseRequest();
          }
        });
        break;
    }
  }

  private updateValidatorsForCurrentStep(): void {
    this.formGroup.get('email')?.clearValidators();
    this.formGroup.get('code')?.clearValidators();
    this.formGroup.get('password')?.clearValidators();
    this.formGroup.get('confirmPassword')?.clearValidators();

    switch (this.currentStep) {
      case 'email':
        this.formGroup.get('email')?.setValidators([Validators.required, Validators.email]);
        break;
      case 'code':
        this.formGroup.get('email')?.setValidators([Validators.required, Validators.email]);
        this.formGroup.get('code')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
        break;
      case 'password':
        this.formGroup.get('email')?.setValidators([Validators.required, Validators.email]);
        this.formGroup.get('code')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
        this.formGroup.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.formGroup.get('confirmPassword')?.setValidators([Validators.required]);
        break;
    }

    this.formGroup.updateValueAndValidity();
  }


}

