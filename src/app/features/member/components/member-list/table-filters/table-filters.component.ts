import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MemberModel} from "../../../../../core/models/member.model";

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
export class TableFiltersComponent {
  @Output() openFilterPanel = new EventEmitter<void>();

  filtersActive = true; // Just for visual demo
  activeFilterCount = 3; // Just for visual demo

  currentTypeFilter: MemberModel | '' = '';
  searchTerm: string = '';
  currentStatusFilter: string = '';

  applyTypeFilter(shipping: string) {

  }

  applyStatusFilter(s: string) {

  }

  applySearchTerm() {

  }

  clearSearchTerm() {

  }
}
