// list-contribution.component.ts
import {Component, Input} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";

// Define the interface for a Contribution
interface Contribution {
  memberPhoneNumber: string;
  session: string;
  month: string;
  montant: number;
  dateEnregistrement: Date;
}

@Component({
  selector: 'app-list-contribution',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './list-contribution.component.html',
  styleUrl: './list-contribution.component.css'
})

export class ListContributionComponent {
  @Input() contributions: Contribution[] = []; // Input property to receive contributions

  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Method to get the paginated list of contributions
  get paginatedContributions(): Contribution[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.contributions.slice(startIndex, endIndex);
  }

  // Method to change page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Method to get the total number of pages
  get totalPages(): number {
    return Math.ceil(this.contributions.length / this.itemsPerPage);
  }

  // Method to generate an array of page numbers
  totalPagesArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }
}
