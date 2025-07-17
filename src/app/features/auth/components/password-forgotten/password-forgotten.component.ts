import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-password-forgotten',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './password-forgotten.component.html',
  styleUrl: './password-forgotten.component.css'
})
export class PasswordForgottenComponent {
  formGroup: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      // In a real application, you would call a service to handle the password reset request.
      console.log('Password reset requested for:', this.formGroup.value.email);
      this.isSubmitted = true;
      this.router.navigate(['/auth', 'code-validation']);
    }
  }
}
