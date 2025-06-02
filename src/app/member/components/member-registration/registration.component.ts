import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf, NgFor} from "@angular/common"; // Added NgFor
import {YearOfSessionService} from "../../../core/services/year-of-session.service";
import {SessionModel} from "../../../core/models/session.model";
import {ToastrService} from "ngx-toastr";
import {MemberService} from "../../core/member.service";
import {MemberModel} from "../../../core/models/member.model"; // Assuming a MemberModel exists

@Component({
  selector: 'app-member-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgFor // Added NgFor for the table iteration
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {

  reinscriptionForm!: FormGroup;
  currentSession!: SessionModel; // Renamed for clarity
  availableSessions: SessionModel[] = []; // Initialize as array of SessionModel
  members: MemberModel[] = []; // To hold the list of members

  constructor(
    private fb: FormBuilder,
    private sessionService: YearOfSessionService,
    private toaster: ToastrService,
    private memberService: MemberService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadCurrentSession();
    this.loadAvailableSessions(); // New method to load all sessions
    this.loadMembers(); // New method to load members
  }

  initForm(): void {
    this.reinscriptionForm = this.fb.group({
      id: [null],
      memberPhoneNumber: ["", Validators.required], // Disabled initially
      session: [null, Validators.required],
      registrationType: ['REINSCRIPTION', Validators.required],
      statusPayment: [false, Validators.required],
      registrationStatus: ['VALID', Validators.required]
    });
  }

  loadCurrentSession(): void {
    this.sessionService.getCurrentYear().subscribe({
      next: resp => {
        if (resp.result === "Succeeded") {
          this.currentSession = resp.data;
          // Optionally pre-select the current session in the form
          this.reinscriptionForm.get('session')?.setValue(this.currentSession.id);
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors du chargement de la session actuelle.");
        console.error(err);
      }
    });
  }

  loadAvailableSessions(): void {
    this.sessionService.getYears().subscribe({
      next: resp => {
        if (resp.result === "Succeeded") {
          this.availableSessions = resp.data;
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors du chargement des sessions disponibles.");
        console.error(err);
      }
    });
  }


  loadMembers(): void {
    this.memberService.getMemberBySession(this.currentSession.id).subscribe({ // Assuming a getMembers method in MemberService
      next: resp => {
        if (resp.result === "Succeeded") {
          this.members = resp.data;
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors du chargement des membres.");
        console.error(err);
      }
    });
  }

  /**
   * Pre-fills the re-enrollment form with the selected member's information.
   * @param member The member object to re-enroll.
   */
  onSelectMemberForReEnrollment(member: MemberModel): void {
    this.reinscriptionForm.patchValue({
      id: member.id, // Set the member's ID
      // memberPhoneNumber: member.numberPhone,
      // You might want to pre-select the current session here as well,
      // or let the user choose.
      session: this.currentSession ? this.currentSession.id : null,
      registrationType: 'REINSCRIPTION', // Default to renewal for re-enrollment
      statusPayment: false // Default to not paid
    });
    this.reinscriptionForm.get('memberPhoneNumber')?.enable(); // Enable if you want user to edit
  }


  onSubmit(): void {
    // Ensure the memberPhoneNumber is enabled before submitting if it was disabled
    this.reinscriptionForm.get('memberPhoneNumber')?.enable();

    if (this.reinscriptionForm.valid) {
      this.reinscriptionForm.markAllAsTouched();
      this.memberService.register(this.reinscriptionForm.value).subscribe({
        next: resp => {
          this.toaster.success("L'inscription a réussi !");
          this.reinscriptionForm.reset();
          this.reinscriptionForm.get("registrationStatus")?.setValue("VALID");
          this.reinscriptionForm.get("statusPayment")?.setValue(false);
          this.reinscriptionForm.get('memberPhoneNumber')?.disable(); // Re-disable after reset
          // Optionally refresh the member list to reflect the new registration
          this.loadMembers();
        },
        error: err => {
          if (err.error && err.error.error && err.error.error.code) {
            if (err.error.error.code === 'MEMBER_ALL_READY_REGISTERED') {
              this.toaster.info(err.error.error.message);
            } else if (err.error.error.code === "ENTITY_NOT_FOUND") {
              this.toaster.info(err.error.error.message);
            } else {
              this.toaster.error("Une erreur inattendue est survenue lors de l'inscription.");
            }
          } else {
            this.toaster.error("Une erreur est survenue lors de l'inscription.");
          }
          console.error(err);
        }
      });
    } else {
      this.toaster.warning("Veuillez remplir tous les champs obligatoires du formulaire.");
    }
  }

}
