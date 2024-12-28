import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        username: this.formBuilder.control('', [Validators.required]),
        password: this.formBuilder.control('', [Validators.required])
      }
    )
  }


  handleLogin() {
    if (this.formGroup.value.username == "aemud" && this.formGroup.value.password == "passer") {
      this.router.navigateByUrl("shared/home")
    } else {
      this.router.navigateByUrl("/")
    }
    console.log(this.formGroup.value.username);

  }
}
