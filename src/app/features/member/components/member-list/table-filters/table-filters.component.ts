import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MemberStateService} from "../../../services/member.state.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-table-filters',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './table-filters.component.html',
  styleUrl: './table-filters.component.scss'
})
export class TableFiltersComponent implements OnInit, OnDestroy {
  @Output() openFilterPanel = new EventEmitter<void>();

  filtersActive = false;
  activeFilterCount = 0;

  searchTerm = '';
  private memberStateService = inject(MemberStateService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.memberStateService.searchMemberParamsObject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.searchTerm = params.keyword || ''; // Assuming 'searchTerm' is the key for the search input
      this.calculateActiveFilters(params);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applySearchTerm() {
    this.memberStateService.updateSearchParams({keyword: this.searchTerm, page: 1});
    this.memberStateService.fetchMembers().subscribe();
  }

  clearSearchTerm() {
    this.searchTerm = '';
    this.applySearchTerm();
  }

  private calculateActiveFilters(params: any): void {
    let count = 0;
    const filterableParams = {...params};

    // Exclude pagination, sorting, and search term from the filter count
    delete filterableParams.page;
    delete filterableParams.rpp;
    delete filterableParams.sort;
    delete filterableParams.searchTerm; // Search term is handled separately

    for (const key in filterableParams) {
      if (filterableParams.hasOwnProperty(key)) {
        const value = filterableParams[key];
        // Consider a filter active if its value is not null, not an empty string, and not an empty array
        if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          count++;
        }
      }
    }
    // Add search term to count if it's active
    if (params.searchTerm && params.searchTerm !== '') {
      count++;
    }

    this.activeFilterCount = count;
    this.filtersActive = count > 0;
  }
}
