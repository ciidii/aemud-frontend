import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../../user/services/user.service";
import { finalize} from "rxjs";
import {FormErrorService} from "../../../../core/services/form-error.service";
import {passwordMatchValidator} from "../first-connection-password/first-connection-password.component";
import {ValidationMessageComponent} from "../../../../shared/components/validation-message/validation-message.component";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-password-forgotten',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink, ValidationMessageComponent],
  templateUrl: './password-forgotten.component.html',
  styleUrls: ['./password-forgotten.component.scss']
})
export class PasswordForgottenComponent {
  formGroup: FormGroup;
  currentStep: 'email' | 'code' | 'password' = 'email';
  completedSteps = new Set<'email' | 'code' | 'password'>();
  isLoading = false;

  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private formErrorService = inject(FormErrorService);
  private fb = inject(FormBuilder)
  private router = inject(Router)

  constructor() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator('password', 'confirmPassword') });

    this.updateValidatorsForCurrentStep();
  }

  isStepComplete(step: 'email' | 'code' | 'password'): boolean {
    return this.completedSteps.has(step);
  }

  editEmail(): void {
    this.currentStep = 'email';
    this.completedSteps.clear();
    this.formGroup.reset();
    this.updateValidatorsForCurrentStep();
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const finaliseRequest = () => this.isLoading = false;

    switch (this.currentStep) {
      case 'email':
        this.userService.checkForgottenPasswordEmail(this.formGroup.controls['email'].value).pipe(
          finalize(finaliseRequest)
        ).subscribe({
          next: () => {
            this.completedSteps.add('email');
            this.currentStep = 'code';
            this.notificationService.showSuccess('Un code de réinitialisation a été envoyé.');
            this.updateValidatorsForCurrentStep();
          },
          error: (err) => this.formErrorService.handleServerErrors(err, this.formGroup)
        });
        break;

      case 'code':
        this.userService.checkForgottenPasswordToken(this.formGroup.controls['email'].value, this.formGroup.controls['code'].value).pipe(
          finalize(finaliseRequest)
        ).subscribe({
          next: () => {
            this.completedSteps.add('code');
            this.currentStep = 'password';
            this.notificationService.showSuccess('Code vérifié. Définissez votre nouveau mot de passe.');
            this.updateValidatorsForCurrentStep();
          },
          error: (err) => this.formErrorService.handleServerErrors(err, this.formGroup)
        });
        break;

      case 'password':
        this.userService.resetForgottenPassword(this.formGroup.controls['password'].value, this.formGroup.controls['confirmPassword'].value, this.formGroup.controls['email'].value, this.formGroup.controls['code'].value).pipe(
          finalize(finaliseRequest)
        ).subscribe({
          next: () => {
            this.notificationService.showSuccess('Mot de passe réinitialisé avec succès ! Redirection...');
            setTimeout(() => this.router.navigate(['/auth', 'login']), 2000);
          },
          error: (err) => this.formErrorService.handleServerErrors(err, this.formGroup)
        });
        break;
    }
  }

  private updateValidatorsForCurrentStep(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.disable();
    });

    switch (this.currentStep) {
      case 'email':
        this.formGroup.get('email')?.enable();
        break;
      case 'code':
        this.formGroup.get('email')?.enable();
        this.formGroup.get('code')?.enable();
        break;
      case 'password':
        this.formGroup.get('email')?.enable();
        this.formGroup.get('code')?.enable();
        this.formGroup.get('password')?.enable();
        this.formGroup.get('confirmPassword')?.enable();
        break;
    }
    this.formGroup.updateValueAndValidity();
  }
}

