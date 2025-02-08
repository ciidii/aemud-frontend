import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {YearOfSessionResponse} from "../../../core/models/session/YearOfSessionResponse";
import {YearOfSessionServiceService} from "../../../core/services/session/year-of-session-service.service";
import {ToastrService} from "ngx-toastr";
import {MonthData} from "../../../core/services/MonthData";
import {BourseService} from "../../../core/services/Bourse/bourse.service";
import {ContributionService} from "../../../core/services/contribution.service";

@Component({
  selector: 'app-contribution',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: 'contribute.component.html'
})
export class ContributeComponent implements OnInit {
  contributionForm!: FormGroup;
  sessions: YearOfSessionResponse[] = [];
  months: MonthData[] = [];
  memberAmount!: number;

  constructor(
    private fb: FormBuilder,
    private sessionService: YearOfSessionServiceService,
    private toaster: ToastrService,
    private bourseService: BourseService,
    private contributionService:ContributionService
  ) {
  }

  ngOnInit(): void {
    this.contributionForm = this.fb.group({
      memberPhoneNumber: ['', [Validators.required, Validators.pattern(/^\+221\d{9}$/)]],
      session: ['', Validators.required],
      month: ['', Validators.required],
      montant: ['']
    });

    this.loadSessions();
    this.loadMonths();

    this.contributionForm.get('memberPhoneNumber')?.valueChanges.subscribe(phone => {
      if (this.contributionForm.get('memberPhoneNumber')?.valid) {
        this.getMemberContributionAmount(phone);
      } else {
        this.contributionForm.get('montant')?.setValue('Montant Bourse Introuvable');
      }
    });
  }

  private loadSessions(): void {
    this.sessionService.getCurrentYear().subscribe({
      next: resp => {
        if (resp.result === "Succeeded" && resp.data) {
          this.sessions = [resp.data]; // Adapter selon les besoins si plusieurs sessions sont attendues
        }
      },
      error: () => this.toaster.error("Erreur lors de la récupération des sessions")
    });
  }

  private loadMonths(): void {
    this.sessionService.getMonth().subscribe({
      next: resp => {
        if (resp.result === "Succeeded" && resp.data) {
          this.months = resp.data;
        }
      },
      error: () => this.toaster.error("Erreur lors de la récupération des mois")
    });
  }

  private getMemberContributionAmount(phone: string): void {
    this.bourseService.getBourseAmount(phone).subscribe({
      next: resp => {
        if (resp.status === "OK" && resp.data) {
          this.memberAmount = resp.data;
          this.contributionForm.get('montant')?.setValue(this.memberAmount);
        } else {
          this.contributionForm.get('montant')?.setValue('Montant non disponible');
        }
      },
      error: () => this.toaster.error("Erreur lors de la récupération du montant")
    });
  }

  onSubmit(): void {
    if (this.contributionForm.valid) {
        this.contributionService.getContribute(this.contributionForm.get("memberPhoneNumber")?.value,this.contributionForm.get("month")?.value,this.contributionForm.get("session")?.value).subscribe({
          next:resp=>{
            if (resp.status=="OK"){
              this.toaster.success("Cotisation Ajouter Avec Success")
              this.contributionForm.reset();
            }
          },error:err => {
            console.log()
            if (err.error.error.code=="ENTITY_ALL_READY_REGISTERED"){
              this.toaster.info(err.error.error.message)
            }
          }
        })
    }
  }
}
