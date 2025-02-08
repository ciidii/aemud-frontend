import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {YearOfSessionServiceService} from "../../../core/services/session/year-of-session-service.service";
import {YearOfSessionResponse} from "../../../core/models/session/YearOfSessionResponse";
import {ToastrService} from "ngx-toastr";
import {MemberService} from "../../../core/services/member.service";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    JsonPipe
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {


  reinscriptionForm!: FormGroup;
  session!: YearOfSessionResponse

  constructor(private fb: FormBuilder, private sessionService: YearOfSessionServiceService, private toaster: ToastrService, private memberService: MemberService) {
  }


  ngOnInit(): void {
    this.sessionService.getCurrentYear().subscribe({
      next: resp => {
        if (resp.result == "Succeeded") {
          this.session = resp.data;
        }
      }, error: err => {
        this.toaster.error("Une s'est produite");
      }
    });

    this.reinscriptionForm = this.fb.group({
      id: [null],
      memberPhoneNumber: [null, Validators.required],
      session: [null, Validators.required],
      registrationType: ['INITIAL', Validators.required],
      statusPayment: [false, Validators.required],
      registrationStatus: ['VALID', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reinscriptionForm.valid) {
      this.reinscriptionForm.markAllAsTouched();
      this.memberService.register(this.reinscriptionForm.value).subscribe({
        next: resp => {
          this.toaster.success("L'inscription reussi");
          this.reinscriptionForm.reset();
          this.reinscriptionForm.get("registrationStatus")?.setValue("VALID");
          this.reinscriptionForm.get("statusPayment")?.setValue(false);
        },
        error: err => {
          if (err.error.error.code == 'MEMBER_ALL_READY_REGISTERED') {
            this.toaster.info(err.error.error.message)
          }
        }
      })
    }
  }

}
