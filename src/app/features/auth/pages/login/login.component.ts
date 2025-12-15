import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthHttpService} from "../../services/auth-http.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {BehaviorSubject, finalize, switchMap} from "rxjs";
import {UserModel} from "../../../../core/models/user.model";
import {FormErrorService} from "../../../../core/services/form-error.service";
import {ValidationMessageComponent} from "../../../../shared/components/validation-message/validation-message.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink, AsyncPipe, ValidationMessageComponent]
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthHttpService);
  private router = inject(Router);
  private formErrorService = inject(FormErrorService);
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  handleLogin(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this._loading.next(true);
    this.authService.login(this.formGroup.value).pipe(
      switchMap(() => this.authService.getMe()),
      finalize(() => this._loading.next(false))
    ).subscribe({
      next: (user) => {
        if (user.forcePasswordChange) {
          this.router.navigateByUrl('auth/first-connection-password');
        } else if (user.locked) {
          // This case should ideally be handled by a 4xx error on login,
          // but we keep it as a safeguard.
          this.formErrorService.handleServerErrors({
            error: {message: "Votre compte est verrouillé."}
          } as any, this.formGroup);
        } else {
          this.router.navigateByUrl('members/list-members');
        }
      },
      error: (err) => {
        this.formErrorService.handleServerErrors(err, this.formGroup);
      }
    });
  }
}
