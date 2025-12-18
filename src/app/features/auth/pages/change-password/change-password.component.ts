import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthHttpService} from "../../services/auth-http.service";
import {finalize} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {passwordMatchValidator} from "../first-connection-password/first-connection-password.component";
import {FormErrorService} from "../../../../core/services/form-error.service";
import {ValidationMessageComponent} from "../../../../shared/components/validation-message/validation-message.component";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AsyncPipe, ValidationMessageComponent]
})
export class ChangePasswordComponent implements OnInit {
  formGroup!: FormGroup;
  isLoading = false;

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthHttpService);
  private formErrorService = inject(FormErrorService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator('newPassword', 'confirmPassword') });
  }

  handleChangePassword(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    this.authService.firstConnectionPasswordChange(this.formGroup.value)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.notificationService.showSuccess("Mot de passe changé avec succès !");
          this.router.navigateByUrl('/auth/login');
        },
        error: (err) => {
          this.formErrorService.handleServerErrors(err, this.formGroup);
        }
      });
  }
}
