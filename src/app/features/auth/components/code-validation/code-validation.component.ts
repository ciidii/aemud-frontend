import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-code-validation',
  templateUrl: './code-validation.component.html',
  standalone: true,
  styleUrls: ['./code-validation.component.scss']
})
export class CodeValidationComponent {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.formGroup = this.fb.group({
      code: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const code = this.formGroup.value.code;
      this.authService.validateResetCode(code).subscribe(response => {
        if (response.success) {
          this.router.navigate(['/auth', 'new-password']);
        } else {
          // Handle invalid code
          console.log('Invalid code');
        }
      });
    }
  }
}
