import {Component, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FinanceHttpService} from '../../services/finance-http.service';
import {FinancialDashboardDto, PaymentReceiptDto} from '../../models/finance.model';
import {ReceiptModalComponent} from '../../components/receipt-modal/receipt-modal.component';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, DatePipe, DecimalPipe, ReceiptModalComponent],
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.scss']
})
export class FinanceDashboardComponent implements OnInit {

  stats: FinancialDashboardDto | null = null;
  recentPayments: PaymentReceiptDto[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  selectedReceipt: PaymentReceiptDto | null = null;
  isReceiptModalOpen: boolean = false;

  constructor(private financeService: FinanceHttpService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.financeService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stats = res.data;
        }
        this.loadRecentPayments();
      },
      error: (err) => {
        this.errorMessage = "Impossible de charger les statistiques financières.";
        this.isLoading = false;
      }
    });
  }

  loadRecentPayments(): void {
    this.financeService.getRecentPayments(15).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.recentPayments = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  viewReceipt(receipt: PaymentReceiptDto): void {
    this.selectedReceipt = receipt;
    this.isReceiptModalOpen = true;
  }

  closeReceiptModal(): void {
    this.isReceiptModalOpen = false;
    this.selectedReceipt = null;
  }

  getMethodBadgeClass(method: string): string {
    switch (method?.toUpperCase()) {
      case 'WAVE_MONEY':
      case 'WAVE':
        return 'badge-wave';
      case 'ORANGE_MONEY':
      case 'OM':
        return 'badge-orange';
      default:
        return 'badge-cash';
    }
  }

  getMethodLabel(method: string): string {
    switch (method?.toUpperCase()) {
      case 'WAVE_MONEY':
      case 'WAVE':
        return 'Wave';
      case 'ORANGE_MONEY':
      case 'OM':
        return 'Orange Money';
      default:
        return 'Espèces';
    }
  }
}
