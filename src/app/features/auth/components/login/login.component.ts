import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {BehaviorSubject, finalize} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink, AsyncPipe]
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  errorMessage: string | null = null;
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
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
      return;
    }
    this.errorMessage = null;
    this._loading.next(true);
    this.authService.login(this.formGroup.value)
      .pipe(finalize(() => this._loading.next(false)))
      .subscribe({
        error: (err) => {
          this.errorMessage = err.error.error.message
        }
      });
  }
}
