// add-contribution.component.ts
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from "@angular/common";
import {SessionModel} from "../../../core/models/session.model";
import {YearOfSessionService} from "../../../core/services/year-of-session.service";
import {ToastrService} from "ngx-toastr";
import {MonthDataModel} from "../../../core/models/month-data.model";
import {BourseService} from "../../../core/services/bourse.service";
import {ContributionService} from "../../../core/services/contribution.service";
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {of} from "rxjs"; // Import 'of' for simulating HTTP calls

@Component({
  selector: 'app-add-contribution',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-contribution.component.html',
  styleUrls: ['./add-contribution.component.scss']
})
export class AddContributionComponent implements OnInit {
  @Output() contributionAdded = new EventEmitter<any>(); // Event emitter for parent component

  contributionForm!: FormGroup;
  sessions: SessionModel[] = [];
  months: MonthDataModel[] = [];
  memberAmount: number | null = null;

  constructor(
    private fb: FormBuilder,
    private sessionService: YearOfSessionService, // Keep if actual service is used
    private toaster: ToastrService,
    private bourseService: BourseService, // Keep if actual service is used
    private contributionService: ContributionService // Keep if actual service is used
  ) {
  }

  ngOnInit(): void {
    this.contributionForm = this.fb.group({
      memberPhoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      session: ['', Validators.required],
      month: ['', Validators.required],
      montant: [{value: '', disabled: true}]
    });

    this.loadSessions();
    this.loadMonths();

    this.contributionForm.get('memberPhoneNumber')?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(phoneNumber => {
        if (this.contributionForm.get('memberPhoneNumber')?.valid) {
          this.getMemberContributionAmount(phoneNumber);
        } else {
          this.memberAmount = null;
          this.contributionForm.get('montant')?.setValue('Saisir un numéro valide');
        }
      });
  }

  private loadSessions(): void {
    // Simulate fetching sessions
    of({
      result: "Succeeded",
      data: {id: 'session1', session: '2024-2025', currentYear: true} // Example session data
    }).subscribe({
      next: resp => {
        if (resp.result === "Succeeded" && resp.data) {
          // this.sessions = [resp.data];
        } else {
          this.sessions = [];
        }
      },
      error: () => this.toaster.error("Erreur lors de la récupération des sessions. Veuillez réessayer.")
    });
  }

  private loadMonths(): void {
    // Simulate fetching months
    of({
      result: "Succeeded",
      data: [
        {id: 'm1', monthName: 'Janvier'},
        {id: 'm2', monthName: 'Février'},
        {id: 'm3', monthName: 'Mars'},
        {id: 'm4', monthName: 'Avril'},
        {id: 'm5', monthName: 'Mai'},
        {id: 'm6', monthName: 'Juin'},
        {id: 'm7', monthName: 'Juillet'},
        {id: 'm8', monthName: 'Août'},
        {id: 'm9', monthName: 'Septembre'},
        {id: 'm10', monthName: 'Octobre'},
        {id: 'm11', monthName: 'Novembre'},
        {id: 'm12', monthName: 'Décembre'},
      ]
    }).subscribe({
      next: resp => {
        if (resp.result === "Succeeded" && resp.data) {
          // this.months = resp.data;
        } else {
          this.months = [];
        }
      },
      error: () => this.toaster.error("Erreur lors de la récupération des mois. Veuillez réessayer.")
    });
  }

  private getMemberContributionAmount(phone: string): void {
    // Simulate API call for member amount
    of({status: "OK", data: 5000}).subscribe({ // Simulate a fixed amount for now
      next: resp => {
        if (resp.status === "OK" && resp.data !== undefined && resp.data !== null) {
          this.memberAmount = resp.data;
          this.contributionForm.get('montant')?.setValue(this.memberAmount);
        } else {
          this.memberAmount = null;
          this.contributionForm.get('montant')?.setValue('Montant non trouvé');
          this.toaster.info("Aucun montant de bourse trouvé pour ce membre.");
        }
      },
      error: (err) => {
        this.memberAmount = null;
        this.contributionForm.get('montant')?.setValue('Erreur de récupération');
        this.toaster.error("Erreur lors de la récupération du montant de la bourse.");
        console.error("Erreur BourseService:", err);
      }
    });
  }

  onSubmit(): void {
    if (this.contributionForm.valid && this.memberAmount !== null) {
      const newContribution = {
        memberPhoneNumber: this.contributionForm.get("memberPhoneNumber")?.value,
        session: this.sessions.find(s => s.id === this.contributionForm.get("session")?.value)?.session,
        month: this.months.find(m => m.id === this.contributionForm.get("month")?.value)?.monthName,
        montant: this.memberAmount,
        dateEnregistrement: new Date() // Add current date for simulation
      };

      // Simulate successful contribution and emit to parent
      of({status: "OK"}).subscribe({
        next: resp => {
          if (resp.status === "OK") {
            this.toaster.success("Cotisation ajoutée avec succès !");
            this.contributionAdded.emit(newContribution); // Emit the new contribution
            this.contributionForm.reset(); // Reset the form
            this.memberAmount = null; // Reset member amount
            this.contributionForm.get('montant')?.setValue(''); // Clear montant field
            this.contributionForm.get('session')?.setValue(''); // Clear session selection
            this.contributionForm.get('month')?.setValue(''); // Clear month selection
          }
        },
        error: err => {
          console.error("Erreur lors de l'ajout de la cotisation:", err);
          if (err.error?.error?.code === "ENTITY_ALL_READY_REGISTERED") {
            this.toaster.info(err.error.error.message || "Cotisation déjà enregistrée pour ce mois et cette session.");
          } else {
            this.toaster.error("Échec de l'ajout de la cotisation. Veuillez réessayer.");
          }
        }
      });
    } else {
      this.contributionForm.markAllAsTouched();
      this.toaster.warning("Veuillez corriger les erreurs dans le formulaire et assurez-vous que le montant du membre est défini.");
    }
  }
}
