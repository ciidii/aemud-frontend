import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../../user/services/user.service";
import {catchError, throwError} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {types} from "sass";
import Error = types.Error; // Importer les opérateurs nécessaires

@Component({
  selector: 'app-password-forgotten',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './password-forgotten.component.html',
  styleUrl: './password-forgotten.component.css'
})
export class PasswordForgottenComponent{
  formGroup: FormGroup;
  isSubmitted = false;
  currentStep: 'email' | 'code' | 'password' = 'email';
  completedSteps: Set<'email' | 'code' | 'password'> = new Set();
  private userService = inject(UserService);

  // Pour afficher des messages utilisateur
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  private toaster = inject(ToastrService);
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
        this.formGroup.get('email')?.setValidators([Validators.required, Validators.email]); // Garde les validateurs de l'email
        this.formGroup.get('code')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6)]); // Garde les validateurs du code
        this.formGroup.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.formGroup.get('confirmPassword')?.setValidators([Validators.required]);
        break;
    }

    // Mettre à jour la validité du formulaire après avoir changé les validateurs
    this.formGroup.updateValueAndValidity();
  }

  isStepComplete(step: 'email' | 'code' | 'password'): boolean {
    return this.completedSteps.has(step);
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = null; // Réinitialiser les messages d'erreur
    this.successMessage = null; // Réinitialiser les messages de succès

    // Assurez-vous que les validateurs sont à jour pour l'étape courante AVANT de valider
    this.updateValidatorsForCurrentStep();

    // Mark all fields as touched to display validation errors
    if (this.currentStep === 'email') {
      this.formGroup.controls['email'].markAsTouched();
    } else if (this.currentStep === 'code') {
      this.formGroup.controls['code'].markAsTouched();
    } else if (this.currentStep === 'password') {
      this.formGroup.controls['password'].markAsTouched();
      this.formGroup.controls['confirmPassword'].markAsTouched();
      // Ajout manuel de l'erreur de non-concordance des mots de passe
      if (this.formGroup.value.password !== this.formGroup.value.confirmPassword) {
        this.formGroup.controls['confirmPassword'].setErrors({passwordsMismatch: true});
      } else {
        // Supprimer l'erreur si les mots de passe correspondent à nouveau
        if (this.formGroup.controls['confirmPassword'].hasError('passwordsMismatch')) {
          const errors = {...this.formGroup.controls['confirmPassword'].errors};
          delete errors['passwordsMismatch'];
          this.formGroup.controls['confirmPassword'].setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }


    if (this.formGroup.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return; // Arrêter si le formulaire n'est pas valide pour l'étape actuelle
    }

    this.isLoading = true; // Démarre le spinner ici

    const finaliseRequest = () => {
      this.isLoading = false; // Arrête le spinner à la fin de la requête
      this.isSubmitted = false;
    }

    switch (this.currentStep) {
      case 'email':
        this.userService.checkForgottenPasswordEmail(this.formGroup.controls['email'].value).pipe(
          catchError(err => {
            console.error('Erreur lors de la vérification de l\'e-mail:', err);
            this.formGroup.controls['email'].setErrors({serverError: true}); // Erreur générique du serveur
            if (err.status === 404) { // Exemple: email non trouvé
              this.errorMessage = 'Cette adresse e-mail n\'existe pas dans nos dossiers.';
            } else {
              this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
            }
            return throwError(() => new Error('API Error'));
          })
        ).subscribe({
          next: () => {
            console.log('Demande de réinitialisation de mot de passe pour :', this.formGroup.value.email);
            this.completedSteps.add('email');
            this.currentStep = 'code';
            this.successMessage = 'Un code de réinitialisation a été envoyé à votre adresse e-mail.';
            this.updateValidatorsForCurrentStep();
            finaliseRequest(); // Arrête le spinner et réinitialise isSubmitted
          },
          error: () => {
            finaliseRequest(); // Arrête le spinner même en cas d'erreur
          }
        });
        break;

      case 'code':
        this.userService.checkForgottenPasswordToken(this.formGroup.controls['email'].value, this.formGroup.controls['code'].value).pipe(
          catchError(err => {
            this.formGroup.controls['code'].setErrors({serverError: true}); // Erreur générique du serveur
            if (err.status === 400 || err.status === 401) { // Exemple: code invalide ou expiré
              this.errorMessage = 'Code de réinitialisation invalide ou expiré.';
            } else {
              this.errorMessage = 'Une erreur est survenue lors de la vérification du code. Veuillez réessayer.';
            }
            return throwError(() => new Error('API Error'));
          })
        ).subscribe({
          next: () => {
            this.completedSteps.add('code');
            this.currentStep = 'password';
            this.successMessage = 'Code vérifié avec succès. Vous pouvez maintenant définir votre nouveau mot de passe.';
            this.updateValidatorsForCurrentStep();
            finaliseRequest(); // Arrête le spinne
          },
          error: () => {
            finaliseRequest(); // Arrête le spinner
          }
        });
        break;

      case 'password':
        // Correction de l'ordre des paramètres : password, confirmPassword, email, code
        this.userService.resetForgottenPassword(this.formGroup.controls['password'].value, this.formGroup.controls['confirmPassword'].value, this.formGroup.controls['email'].value, this.formGroup.controls['code'].value).pipe(
          catchError(err => {
            this.errorMessage = 'Échec de la réinitialisation du mot de passe. Veuillez vérifier vos informations.';
            return throwError(() => new Error('API Error'));
          })
        ).subscribe({
          next: () => {
            console.log('Mot de passe réinitialisé avec succès !');
            this.completedSteps.add('password');
            this.successMessage = 'Votre mot de passe a été réinitialisé avec succès ! Vous allez être redirigé.';
            finaliseRequest(); // Arrête le spinner
            setTimeout(() => {
              this.toaster.success("Réussi !")
              this.router.navigate(['/auth', 'login']);
            }, 1000);
          },
          error: () => {
            finaliseRequest(); // Arrête le spinner
          }
        });
        break;
    }
  }


}
