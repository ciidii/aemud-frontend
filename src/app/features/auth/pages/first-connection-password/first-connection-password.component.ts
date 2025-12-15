import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {AuthHttpService} from "../../services/auth-http.service";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
import {FormErrorService} from "../../../../core/services/form-error.service";
import {ValidationMessageComponent} from "../../../../shared/components/validation-message/validation-message.component";

// Custom Validator
export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (matchingControl?.errors && !matchingControl.errors['passwordMismatch']) {
      // Return if another validator has already found an error on the matchingControl
      return null;
    }

    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      matchingControl?.setErrors(null);
      return null;
    }
  };
}


@Component({
  selector: 'app-first-connection-password',
  templateUrl: './first-connection-password.component.html',
  styleUrls: ['./first-connection-password.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AsyncPipe, ValidationMessageComponent]
})
export class FirstConnectionPasswordComponent implements OnInit {
  formGroup!: FormGroup;
  isLoading = false;
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthHttpService);
  private router = inject(Router);
  private formErrorService = inject(FormErrorService);

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator('password', 'confirmPassword') });
  }

  handlePasswordChange(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { password, confirmPassword } = this.formGroup.value;

    this.authService.changePassword(password, confirmPassword).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl("/members/list-members");
      },
      error: (err) => {
        this.formErrorService.handleServerErrors(err, this.formGroup);
      }
    });
  }
}
