import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthHttpService} from "../../services/auth-http.service";
import {finalize} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf]
})
export class ChangePasswordComponent implements OnInit {
  formGroup!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthHttpService
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  handleChangePassword(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.firstConnectionPasswordChange(this.formGroup.value)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: resp => {
          this.router.navigateByUrl('/auth/login');
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isLoading = true;
        }
      });
  }
}
