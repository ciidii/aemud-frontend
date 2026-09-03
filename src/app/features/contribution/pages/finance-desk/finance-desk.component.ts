import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, ActivatedRoute} from '@angular/router';
import {FinanceHttpService} from '../../services/finance-http.service';
import {MemberHttpService} from '../../../member/services/member.http.service';
import {
  ContributionDto,
  MemberFinancialCalendarDto,
  PaymentMethod,
  PaymentReceiptDto,
  SmartPaymentRequest,
  ManualPaymentRequest
} from '../../models/finance.model';
import {MemberDataResponse} from '../../../../core/models/member-data.model';
import {ReceiptModalComponent} from '../../components/receipt-modal/receipt-modal.component';

@Component({
  selector: 'app-finance-desk',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, DecimalPipe, ReceiptModalComponent],
  templateUrl: './finance-desk.component.html',
  styleUrls: ['./finance-desk.component.scss']
})
export class FinanceDeskComponent implements OnInit {

  // Recherche membre
  searchKeyword: string = '';
  isSearching: boolean = false;
  searchResults: MemberDataResponse[] = [];
  selectedMember: MemberDataResponse | null = null;

  // Calendrier financier
  isLoadingCalendar: boolean = false;
  calendar: MemberFinancialCalendarDto | null = null;

  // Formulaire d'encaissement
  allocationMode: 'SMART' | 'MANUAL' = 'SMART';
  amount: number = 0;
  paymentMethod: PaymentMethod = 'CASH';
  transactionReference: string = '';
  notes: string = '';

  // Sélection manuelle
  selectedContributionIds: string[] = [];

  // Soumission & Quittance
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createdReceipt: PaymentReceiptDto | null = null;
  isReceiptModalOpen: boolean = false;

  constructor(
    private financeService: FinanceHttpService,
    private memberService: MemberHttpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const memberIdParam = this.route.snapshot.queryParamMap.get('memberId');
    if (memberIdParam) {
      this.loadMemberById(memberIdParam);
    }
  }

  onSearch(): void {
    const kw = this.searchKeyword.trim();
    if (kw.length < 2) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.memberService.searchMember({
      page: 0,
      rpp: 10,
      keyword: kw,
      club: [],
      commission: [],
      paymentStatus: 'ALL',
      bourse: [],
      registrationStatus: null,
      mandatIds: [],
      phaseIds: [],
      registrationType: null,
      sortColumn: 'personalInfo.name',
      sortDirection: true
    }).subscribe({
      next: (res) => {
        this.searchResults = res.items || [];
        this.isSearching = false;
      },
      error: () => {
        this.searchResults = [];
        this.isSearching = false;
      }
    });
  }

  selectMember(m: MemberDataResponse): void {
    this.selectedMember = m;
    this.searchResults = [];
    this.searchKeyword = `${m.personalInfo.firstname} ${m.personalInfo.name}`;
    this.loadCalendar(m.id);
  }

  loadMemberById(memberId: string): void {
    this.memberService.getMemberById(memberId).subscribe({
      next: (res) => {
        if (res.data) {
          this.selectMember(res.data);
        }
      }
    });
  }

  loadCalendar(memberId: string): void {
    this.isLoadingCalendar = true;
    this.calendar = null;
    this.selectedContributionIds = [];
    this.amount = 0;
    this.errorMessage = null;

    this.financeService.getMemberCalendar(memberId).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.calendar = res.data;
          // Initialiser le montant par défaut sur la mensualité
          this.amount = res.data.monthlyAmount || 1000;
        }
        this.isLoadingCalendar = false;
      },
      error: (err) => {
        this.errorMessage = "Impossible de récupérer la situation financière de cet adhérent.";
        this.isLoadingCalendar = false;
      }
    });
  }

  // Calcul dynamique des mois soldés en mode SMART
  getSmartAllocatedMonthsPreview(): string[] {
    if (!this.calendar || this.amount <= 0) return [];
    const unpaid = this.calendar.contributions.filter(c => c.status === 'DELAYED' || c.status === 'PENDING');
    unpaid.sort((a, b) => {
      if (a.status === 'DELAYED' && b.status !== 'DELAYED') return -1;
      if (b.status === 'DELAYED' && a.status !== 'DELAYED') return 1;
      return a.month.localeCompare(b.month);
    });

    let remaining = this.amount;
    const covered: string[] = [];

    for (const c of unpaid) {
      if (remaining <= 0) break;
      const due = c.amountDue - (c.amountPaid || 0);
      if (remaining >= due) {
        covered.push(c.month);
        remaining -= due;
      } else {
        covered.push(`${c.month} (partiel ${remaining} F)`);
        remaining = 0;
      }
    }
    return covered;
  }

  // Toggle sélection manuelle
  toggleContributionSelection(c: ContributionDto): void {
    if (c.status === 'PAID') return;
    const index = this.selectedContributionIds.indexOf(c.id);
    if (index > -1) {
      this.selectedContributionIds.splice(index, 1);
    } else {
      this.selectedContributionIds.push(c.id);
    }
    this.recalculateManualAmount();
  }

  isContributionSelected(c: ContributionDto): boolean {
    return this.selectedContributionIds.includes(c.id);
  }

  recalculateManualAmount(): void {
    if (!this.calendar) return;
    let sum = 0;
    for (const id of this.selectedContributionIds) {
      const found = this.calendar.contributions.find(c => c.id === id);
      if (found) {
        sum += (found.amountDue - (found.amountPaid || 0));
      }
    }
    this.amount = sum;
  }

  onSubmitPayment(): void {
    if (!this.selectedMember || !this.calendar) {
      this.errorMessage = "Veuillez sélectionner un adhérent.";
      return;
    }

    if (this.amount <= 0) {
      this.errorMessage = "Le montant versé doit être supérieur à zéro.";
      return;
    }

    if ((this.paymentMethod === 'WAVE_MONEY' || this.paymentMethod === 'ORANGE_MONEY') && !this.transactionReference.trim()) {
      this.errorMessage = "Veuillez renseigner le code / référence de la transaction pour Wave ou Orange Money.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.allocationMode === 'SMART') {
      const smartReq: SmartPaymentRequest = {
        memberId: this.selectedMember.id,
        amount: this.amount,
        paymentMethod: this.paymentMethod,
        transactionReference: this.transactionReference.trim() || undefined,
        notes: this.notes.trim() || undefined
      };

      this.financeService.recordSmartPayment(smartReq).subscribe({
        next: (res) => {
          this.handlePaymentSuccess(res.data);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement de l'encaissement.";
        }
      });
    } else {
      if (this.selectedContributionIds.length === 0) {
        this.errorMessage = "Veuillez cocher au moins une mensualité à solder.";
        this.isSubmitting = false;
        return;
      }

      const manualReq: ManualPaymentRequest = {
        contributionIds: this.selectedContributionIds,
        paymentMethod: this.paymentMethod,
        transactionReference: this.transactionReference.trim() || undefined,
        notes: this.notes.trim() || undefined
      };

      this.financeService.recordPayment(manualReq).subscribe({
        next: (res) => {
          this.handlePaymentSuccess(res.data);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement du règlement.";
        }
      });
    }
  }

  private handlePaymentSuccess(receipt: PaymentReceiptDto): void {
    this.isSubmitting = false;
    this.createdReceipt = receipt;
    this.isReceiptModalOpen = true;
    this.successMessage = `Versement enregistré avec succès sous la quittance N° ${receipt.receiptNumber}`;

    // Réinitialiser les champs de saisie spécifiques
    this.transactionReference = '';
    this.notes = '';
    this.selectedContributionIds = [];

    // Recharger le calendrier du membre
    if (this.selectedMember) {
      this.loadCalendar(this.selectedMember.id);
    }
  }

  closeReceiptModal(): void {
    this.isReceiptModalOpen = false;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID': return 'badge-paid';
      case 'DELAYED': return 'badge-delayed';
      case 'PENDING': return 'badge-pending';
      default: return 'badge-neutral';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PAID': return 'Soldé';
      case 'DELAYED': return 'Arriéré';
      case 'PENDING': return 'En attente';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  }
}
