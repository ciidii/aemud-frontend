import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { finalize } from "rxjs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink]
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

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
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.formGroup.value)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next:resp => {
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
  }
}
