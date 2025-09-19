import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {finalize} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-first-connection-password',
  templateUrl: './first-connection-password.component.html',
  styleUrls: ['./first-connection-password.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf]
})
export class FirstConnectionPasswordComponent implements OnInit {
  formGroup!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  handlePasswordChange(): void {
    if (this.formGroup.invalid) {
      return;
    }
    if (this.formGroup.value.password !== this.formGroup.value.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }
    this.authService.changePassword(this.formGroup.get("password")?.value, this.formGroup.get("confirmPassword")?.value).pipe(
      finalize(() => {
        this.isLoading = true;
        this.errorMessage = null;
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl("members/member-list")
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    })

  }
}
