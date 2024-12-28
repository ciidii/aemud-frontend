import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {YearOfSessionServiceService} from "../../../core/services/session/year-of-session-service.service";
import {YearOfSessionResponse} from "../../../core/models/session/YearOfSessionResponse";

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent implements OnInit {
  sessions!: YearOfSessionResponse[]
  sessionForm: FormGroup;
  displayForm = false;
  sessionsCanDelete: { [key: number]: boolean } = {};

  constructor(private sessionService: YearOfSessionServiceService,
              private toaster: ToastrService,
              private fb: FormBuilder
  ) {
    this.sessionForm = this.fb.group({
      year_: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      id: [''],
      currentYear: ['']
    });
  }


  ngOnInit(): void {
    this.getAllSessions()
  }

  getAllSessions() {
    this.sessionService.getYears().subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.sessions = resp.data;
          this.sessions.forEach(session => {
            // this.checkIfCanDeleteSession(session.id);
          });
        } else {
          this.toaster.success("Une erreur s'est produite");
        }
      },
      error: err => {
        this.toaster.success("Une erreur s'est produite");
      }
    });
  }

  handleDisplayForm() {
    this.displayForm = !this.displayForm;
  }

  onSubmit() {
    if (this.sessionForm.valid) {
      console.log(this.sessionForm.value)
      this.sessionService.openNewSession(this.sessionForm.value).subscribe({
        next: resp => {
          if (resp.status == "OK") {
            this.toaster.success("Nouvelle année ajouté avec succée")
            this.sessionForm.reset();
            this.displayForm = false;
            this.getAllSessions()
          } else {
            this.toaster.error("Une erreur s'est produite")
          }
        }, error: err => {
          this.toaster.error("Une erreur s'est produite")
        }
      })
    }
  }


  updateSession(sessionID: number) {
    this.sessionService.getPaticulerYear(sessionID).subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.sessionForm.get("year_")?.setValue(resp.data.year_);
          this.sessionForm.get("id")?.setValue(resp.data.id)
          this.sessionForm.get("currentYear")?.setValue(resp.data.currentYear)
          console.log(this.sessionForm.value)
          this.handleDisplayForm()
        }
      },
      error: err => {
        console.log("Une erreur s'est produite")
      }
    })
  }

  deleteSession(id: number) {
    this.sessionService.deleletSession(id).subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.toaster.success("Sppression Réussi")
          this.getAllSessions()
        } else if (resp.status == "CONFLICT") {
        }
      }, error: err => {
        if (err.error.status == "CONFLICT") {
          this.toaster.error("Suppression Impossible")
        }
      }
    })
  }
}
