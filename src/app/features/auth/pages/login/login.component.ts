import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthHttpService} from "../../services/auth-http.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {BehaviorSubject, finalize, switchMap} from "rxjs";
import {NotificationService} from "../../../../core/services/notification.service";
import {UserModel} from "../../../../core/models/user.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink, AsyncPipe]
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthHttpService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
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
      this.notificationService.showError("Veuillez remplir tous les champs.");
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
          this.notificationService.showError("Votre compte est verrouillé.");
        } else {
          this.router.navigateByUrl('members/list-members');
        }
      },
      error: (err) => {
        const errorMessage = err?.error?.message || "Une erreur inconnue est survenue.";
        this.notificationService.showError(errorMessage);
      }
    });
  }
}
