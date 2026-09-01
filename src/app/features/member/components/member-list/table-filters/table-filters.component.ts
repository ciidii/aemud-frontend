import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {MemberStateService} from "../../../services/member.state.service";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

export interface FilterChip {
  key: string;
  label: string;
  value: any;
}

@Component({
  selector: 'app-table-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor
  ],
  templateUrl: './table-filters.component.html',
  styleUrl: './table-filters.component.scss'
})
export class TableFiltersComponent implements OnInit, OnDestroy {
  @Output() openFilterPanel = new EventEmitter<void>();

  filtersActive = false;
  activeFilterCount = 0;
  activeChips: FilterChip[] = [];
  searchTerm = '';
  selectedMemberStatus: string | null = null;
  selectedPaymentStatus: string = '';
  selectedRegistrationStatus: string | null = null;

  private memberStateService = inject(MemberStateService);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.memberStateService.updateSearchParams({
        keyword: term ? term.trim() : null,
        page: 1
      });
      this.memberStateService.fetchMembers().subscribe();
    });

    this.memberStateService.searchMemberParamsObject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.searchTerm = params.keyword || '';
      this.selectedMemberStatus = params.status ?? null;
      this.selectedPaymentStatus = params.paymentStatus || '';
      this.selectedRegistrationStatus = params.registrationStatus ?? null;
      this.calculateActiveFiltersAndChips(params);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  applySearchTerm(): void {
    this.memberStateService.updateSearchParams({keyword: this.searchTerm ? this.searchTerm.trim() : null, page: 1});
    this.memberStateService.fetchMembers().subscribe();
  }

  clearSearchTerm(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  onQuickMemberStatusChange(status: string | null): void {
    this.selectedMemberStatus = status;
    this.memberStateService.setStatusTab(status);
  }

  onQuickPaymentStatusChange(status: string): void {
    this.selectedPaymentStatus = status;
    this.selectedMemberStatus = null;
    this.memberStateService.updateSearchParams({
      status: null,
      paymentStatus: status,
      mandatIds: [],
      phaseIds: [],
      registrationStatus: null,
      page: 1
    });
    this.memberStateService.fetchMembers().subscribe();
  }

  onQuickRegistrationStatusChange(status: string | null): void {
    this.selectedRegistrationStatus = status;
    this.memberStateService.updateSearchParams({ registrationStatus: status, page: 1 });
    this.memberStateService.fetchMembers().subscribe();
  }

  removeChip(chip: FilterChip): void {
    const update: any = { page: 1 };
    if (chip.key === 'keyword') {
      update.keyword = null;
      this.searchTerm = '';
    } else if (chip.key === 'status') {
      update.status = null;
    } else if (chip.key === 'paymentStatus') {
      update.paymentStatus = '';
    } else if (chip.key === 'registrationStatus') {
      update.registrationStatus = null;
    } else if (chip.key === 'club') {
      update.club = [];
    } else if (chip.key === 'commission') {
      update.commission = [];
    } else if (chip.key === 'bourse') {
      update.bourse = [];
    }

    this.memberStateService.updateSearchParams(update);
    this.memberStateService.fetchMembers().subscribe();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.memberStateService.updateSearchParams({
      page: 1,
      keyword: null,
      status: null,
      club: [],
      commission: [],
      paymentStatus: '',
      bourse: [],
      registrationStatus: null
    });
    this.memberStateService.fetchMembers().subscribe();
  }

  private calculateActiveFiltersAndChips(params: any): void {
    const chips: FilterChip[] = [];

    if (params.keyword && params.keyword.trim() !== '') {
      chips.push({ key: 'keyword', label: `Recherche : "${params.keyword}"`, value: params.keyword });
    }

    if (params.status) {
      const statusLabel = params.status === 'ACTIVE' ? 'Étudiants Actifs' :
                          params.status === 'ALUMNI' ? 'Alumni / Diplômés' :
                          params.status === 'INACTIVE' ? 'Inactifs' : params.status;
      chips.push({ key: 'status', label: `Statut : ${statusLabel}`, value: params.status });
    }

    if (params.paymentStatus && params.paymentStatus !== '') {
      const payLabel = params.paymentStatus === 'PAID' ? 'Cotisations à jour' : 'Cotisations en attente';
      chips.push({ key: 'paymentStatus', label: payLabel, value: params.paymentStatus });
    }

    if (params.registrationStatus) {
      const regLabel = params.registrationStatus === 'COMPLETED' ? 'Dossier : Complété' :
                       params.registrationStatus === 'UNCOMPLETED' ? 'Dossier : Incomplet' :
                       params.registrationStatus === 'EXPIRED' ? 'Dossier : Expiré' : `Inscription : ${params.registrationStatus}`;
      chips.push({ key: 'registrationStatus', label: regLabel, value: params.registrationStatus });
    }

    if (params.club && params.club.length > 0) {
      chips.push({ key: 'club', label: `Clubs (${params.club.length})`, value: params.club });
    }

    if (params.commission && params.commission.length > 0) {
      chips.push({ key: 'commission', label: `Commissions (${params.commission.length})`, value: params.commission });
    }

    if (params.bourse && params.bourse.length > 0) {
      chips.push({ key: 'bourse', label: `Bourses (${params.bourse.length})`, value: params.bourse });
    }

    this.activeChips = chips;
    this.activeFilterCount = chips.length;
    this.filtersActive = chips.length > 0;
  }
}
