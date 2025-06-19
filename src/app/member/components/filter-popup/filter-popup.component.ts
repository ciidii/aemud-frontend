import {Component, inject, OnInit, signal} from '@angular/core';
import {ClubService} from "../../../core/services/club.service";
import {CommissionService} from "../../../core/services/commission.service";
import {YearOfSessionService} from "../../../core/services/year-of-session.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms"; // Import Validators
import {MemberService} from "../../core/member.service";
import {AppStateService} from "../../../core/services/app-state.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-filter-popup',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './filter-popup.component.html',
  styleUrl: './filter-popup.component.css'
})
export class FilterPopupComponent implements OnInit {
  private commissionService = inject(CommissionService);
  private clubService = inject(ClubService);
  private sessionService = inject(YearOfSessionService);
  private formBuilder = inject(FormBuilder);
  private memberService = inject(MemberService);
  private appState = inject(AppStateService);
  private toaster = inject(ToastrService);

  openPopup = signal(false);
  clubs$ = this.clubService.getClubs();
  years$ = this.sessionService.getYears();
  commissions$ = this.commissionService.getCommissions();

  months: { value: number, name: string }[] = [
    {value: 1, name: 'Janvier'},
    {value: 2, name: 'Février'},
    {value: 3, name: 'Mars'},
    {value: 4, name: 'Avril'},
    {value: 5, name: 'Mai'},
    {value: 6, name: 'Juin'},
    {value: 7, name: 'Juillet'},
    {value: 8, name: 'Août'},
    {value: 9, name: 'Septembre'},
    {value: 10, name: 'Octobre'},
    {value: 11, name: 'Novembre'},
    {value: 12, name: 'Décembre'}
  ];
  formGroup!: FormGroup;


  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.formGroup = this.formBuilder.group({
      club: [''],
      year: [''],
      commission: [''],
      cotisationMonth: [''], // NEW: Month for cotisation filter
      cotisationStatus: [''], // NEW: Payment status for cotisation filter (PAID/UNPAID)
      registrationFilterType: [''],
      specificRegistrationType: [{value: '', disabled: true}]
    });

    this.formGroup.get('registrationFilterType')?.valueChanges.subscribe(value => {
      if (value === 'specific') {
        this.formGroup.get('specificRegistrationType')?.enable();
        this.formGroup.get('specificRegistrationType')?.setValidators(Validators.required);
      } else {
        this.formGroup.get('specificRegistrationType')?.disable();
        this.formGroup.get('specificRegistrationType')?.setValue('');
        this.formGroup.get('specificRegistrationType')?.clearValidators();
      }
      this.formGroup.get('specificRegistrationType')?.updateValueAndValidity();
    });

    // Conditional logic for cotisationStatus (enable/disable based on cotisationMonth)
    this.formGroup.get('cotisationMonth')?.valueChanges.subscribe(value => {
      if (value) { // If a month is selected, enable cotisationStatus and make it required
        this.formGroup.get('cotisationStatus')?.enable();
        this.formGroup.get('cotisationStatus')?.setValidators(Validators.required);
        // Set a default value if needed, e.g., 'ALL' or 'PAID'
        this.formGroup.get('cotisationStatus')?.setValue(''); // Default to 'Tous les statuts'
      } else { // If no month is selected, disable cotisationStatus and clear its value/validators
        this.formGroup.get('cotisationStatus')?.disable();
        this.formGroup.get('cotisationStatus')?.setValue('');
        this.formGroup.get('cotisationStatus')?.clearValidators();
      }
      this.formGroup.get('cotisationStatus')?.updateValueAndValidity();
    });

    // Initially disable cotisationStatus if no month is selected
    this.formGroup.get('cotisationStatus')?.disable();
  }


  openModal(): void {
    this.openPopup.set(true);
    // Patch form values from appState filters
    this.formGroup.patchValue(this.appState.memberState.filters);

    // Manually trigger valueChanges for conditional fields on opening
    this.formGroup.get('registrationFilterType')?.updateValueAndValidity();
    this.formGroup.get('cotisationMonth')?.updateValueAndValidity(); // Ensure cotisationStatus state is correct
  }

  closeModal(): void {
    this.openPopup.set(false);
  }

  onRegistrationFilterChange(): void {
  }

  applyFilters(): void {
    this.formGroup.markAllAsTouched(); // Mark all fields as touched for validation

    if (this.formGroup.get('registrationFilterType')?.value === 'specific' && this.formGroup.get('specificRegistrationType')?.invalid) {
      this.toaster.warning("Veuillez sélectionner un type d'inscription spécifique.");
      return;
    }

    if (this.formGroup.get('cotisationMonth')?.value && this.formGroup.get('cotisationStatus')?.invalid) {
      this.toaster.warning("Veuillez sélectionner un statut de cotisation pour le mois choisi.");
      return;
    }


    const filters = {...this.formGroup.value}; // Create a copy of form values

    if (filters.registrationFilterType === 'specific') {
      filters.registrationType = filters.specificRegistrationType; // Use the specific type
    } else {
      filters.registrationType = ''; // No specific type filter
    }
    delete filters.registrationFilterType;
    delete filters.specificRegistrationType;

    if (!filters.cotisationMonth) {
      delete filters.cotisationStatus;
    }

    this.appState.memberState.filters = filters;
    this.appState.memberState.currentPage = 1;
    this.memberService.searchMember(
      this.appState.memberState.keyword,
      this.appState.memberState.criteria,
      this.appState.memberState.filters // Pass the adjusted filters
    ).subscribe({
      next: resp => {
        this.appState.memberState.members = resp.items;
        this.appState.memberState.totalPages = resp.pages;
        this.appState.memberState.currentPage = resp.page;
        this.closeModal();
        this.toaster.success("Filtres appliqués avec succès.");
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors de l'application des filtres.");
        console.error(err);
      }
    });
  }
}
