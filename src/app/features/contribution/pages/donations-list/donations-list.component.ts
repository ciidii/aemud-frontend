import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FinanceHttpService} from '../../services/finance-http.service';
import {DonationDto} from '../../models/finance.model';

@Component({
  selector: 'app-donations-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, DecimalPipe],
  templateUrl: './donations-list.component.html',
  styleUrls: ['./donations-list.component.scss']
})
export class DonationsListComponent implements OnInit {

  donations: DonationDto[] = [];
  filteredDonations: DonationDto[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  selectedPurposeFilter: string = 'ALL';

  // Modale nouveau don
  isDonationModalOpen: boolean = false;
  newDonorName: string = '';
  newDonorEmail: string = '';
  newAmount: number = 25000;
  newPaymentMethod: string = 'WAVE_MONEY';
  newPurpose: string = 'Bourses Étudiantes';
  isSavingDonation: boolean = false;

  purposes: string[] = [
    'Bourses Étudiantes',
    'Iftar Ramadan & Restauration',
    'Fonds d\'Urgence Sociale',
    'Projets & Équipements',
    'Général / Fonctionnement'
  ];

  constructor(private financeService: FinanceHttpService) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.financeService.getAllDonations().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.donations = res.data;
          this.applyFilter();
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger la liste des dons et mécénats.";
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.selectedPurposeFilter === 'ALL') {
      this.filteredDonations = [...this.donations];
    } else {
      this.filteredDonations = this.donations.filter(d =>
        d.purpose?.toLowerCase().includes(this.selectedPurposeFilter.toLowerCase())
      );
    }
  }

  getTotalDonationsAmount(): number {
    return this.filteredDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  }

  openDonationModal(): void {
    this.isDonationModalOpen = true;
    this.newDonorName = '';
    this.newDonorEmail = '';
    this.newAmount = 25000;
    this.newPaymentMethod = 'WAVE_MONEY';
    this.newPurpose = 'Bourses Étudiantes';
  }

  closeDonationModal(): void {
    this.isDonationModalOpen = false;
  }

  onSubmitDonation(): void {
    if (!this.newDonorName.trim() || this.newAmount <= 0) {
      return;
    }

    this.isSavingDonation = true;
    const req: DonationDto = {
      donorName: this.newDonorName.trim(),
      donorEmail: this.newDonorEmail.trim() || undefined,
      amount: this.newAmount,
      paymentMethod: this.newPaymentMethod,
      purpose: this.newPurpose
    };

    this.financeService.recordDonation(req).subscribe({
      next: (res) => {
        this.isSavingDonation = false;
        this.isDonationModalOpen = false;
        this.successMessage = `Don de ${this.newAmount} FCFA enregistré avec succès sous le reçu ${res.data.receiptNumber} !`;
        this.loadDonations();
      },
      error: (err) => {
        this.isSavingDonation = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement du don.";
      }
    });
  }
}
