import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  standalone: true,
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.formGroup = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const newPassword = this.formGroup.value.password;
      this.authService.resetPassword(newPassword).subscribe(response => {
        if (response.success) {
          this.router.navigate(['/auth', 'login']);
        } else {
          // Handle error
          console.log('Password reset failed');
        }
      });
    }
  }
}
