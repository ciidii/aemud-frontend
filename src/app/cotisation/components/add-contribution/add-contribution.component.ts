import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common"; // Ajout de CommonModule pour NgClass, NgForOf, NgIf
import {SessionModel} from "../../../core/models/session.model";
import {YearOfSessionService} from "../../../core/services/year-of-session.service";
import {ToastrService} from "ngx-toastr";
import {MonthDataModel} from "../../../core/models/month-data.model";
import {BourseService} from "../../../core/services/bourse.service";
import {ContributionService} from "../../../core/services/contribution.service";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Pour l'observation du numéro de téléphone

@Component({
  selector: 'app-contribution',
  standalone: true,
  imports: [
    CommonModule, // Inclut NgClass, NgForOf, NgIf
    ReactiveFormsModule
  ],
  templateUrl: './add-contribution.component.html', // Chemin corrigé si nécessaire
  styleUrls: ['./add-contribution.component.scss'] // Assurez-vous que le chemin est correct
})
export class AddContributionComponent implements OnInit {
  contributionForm!: FormGroup;
  sessions: SessionModel[] = [];
  months: MonthDataModel[] = [];
  memberAmount: number | null = null; // Initialisé à null pour le message d'info

  constructor(
    private fb: FormBuilder,
    private sessionService: YearOfSessionService,
    private toaster: ToastrService,
    private bourseService: BourseService,
    private contributionService: ContributionService
  ) {
  }

  ngOnInit(): void {
    this.contributionForm = this.fb.group({
      memberPhoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]], // 9 chiffres pour le Sénégal
      session: ['', Validators.required],
      month: ['', Validators.required],
      montant: [{ value: '', disabled: true }] // Champ montant est désactivé et readonly
    });

    this.loadSessions();
    this.loadMonths();

    // Observer les changements du numéro de téléphone pour récupérer le montant
    this.contributionForm.get('memberPhoneNumber')?.valueChanges
      .pipe(
        debounceTime(400), // Attendre 400ms après la dernière frappe
        distinctUntilChanged() // Ne réagit que si la valeur a vraiment changé
      )
      .subscribe(phoneNumber => {
        if (this.contributionForm.get('memberPhoneNumber')?.valid) {
          this.getMemberContributionAmount(phoneNumber);
        } else {
          // Réinitialiser le montant et afficher un message générique si le numéro est invalide
          this.memberAmount = null;
          this.contributionForm.get('montant')?.setValue('Saisir un numéro valide');
        }
      });
  }

  private loadSessions(): void {
    this.sessionService.getCurrentYear().subscribe({
      next: resp => {
        if (resp.result === "Succeeded" && resp.data) {
          // Si resp.data est un objet unique mais que sessions est un tableau
          // Adaptez ici. Par exemple, si 'resp.data' est { id: '...', session: '...' }
          this.sessions = [resp.data];
        } else {
          this.sessions = []; // Assurez-vous que la liste est vide si aucun succès
        }
      },
      error: () => this.toaster.error("Erreur lors de la récupération des sessions. Veuillez réessayer.")
    });
  }

  private loadMonths(): void {
    this.sessionService.getMonth().subscribe({
      next: resp => {
        if (resp.result === "Succeeded" && resp.data) {
          this.months = resp.data;
        } else {
          this.months = []; // Assurez-vous que la liste est vide si aucun succès
        }
      },
      error: () => this.toaster.error("Erreur lors de la récupération des mois. Veuillez réessayer.")
    });
  }

  private getMemberContributionAmount(phone: string): void {
    const phoneWithPrefix = '+221' + phone;
    // Supprimez la ligne suivante si vous utilisez une variable de chargement pour le montant
    // this.contributionForm.get('montant')?.setValue('Chargement...'); // Indique que le montant est en cours de récupération

    this.bourseService.getBourseAmount(phoneWithPrefix).subscribe({
      next: resp => {
        console.log("Réponse Bourse:", resp.data);
        if (resp.status === "OK" && resp.data !== undefined && resp.data !== null) { // Vérifier si data est défini
          this.memberAmount = resp.data;
          this.contributionForm.get('montant')?.setValue(this.memberAmount);
        } else {
          this.memberAmount = null; // Important si le montant n'est pas trouvé
          this.contributionForm.get('montant')?.setValue('Montant non trouvé');
          this.toaster.info("Aucun montant de bourse trouvé pour ce membre.");
        }
      },
      error: (err) => {
        this.memberAmount = null; // Important si erreur
        this.contributionForm.get('montant')?.setValue('Erreur de récupération');
        this.toaster.error("Erreur lors de la récupération du montant de la bourse.");
        console.error("Erreur BourseService:", err);
      }
    });
  }

  onSubmit(): void {
    if (this.contributionForm.valid && this.memberAmount !== null) {
      const phoneWithPrefix = '+221' + this.contributionForm.get("memberPhoneNumber")?.value;
      const selectedMonthId = this.contributionForm.get("month")?.value;
      const selectedSessionId = this.contributionForm.get("session")?.value;

      this.contributionService.getContribute(phoneWithPrefix, selectedMonthId, selectedSessionId).subscribe({
        next: resp => {
          if (resp.status === "OK") {
            this.toaster.success("Cotisation ajoutée avec succès !");
            this.contributionForm.reset(); // Réinitialise le formulaire
            this.memberAmount = null; // Réinitialise le montant du membre
            this.contributionForm.get('montant')?.setValue(''); // Vide le champ montant
            this.contributionForm.get('registrationType')?.setValue('INITIAL'); // Si vous avez un type d'inscription par défaut
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
