import {Component, HostListener, inject, OnInit} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe, Location, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MemberHttpService} from "../../services/member.http.service";
import {MemberDataResponse} from "../../../../core/models/member-data.model";
import {forkJoin, map, Observable} from "rxjs";
import {ResponseEntityApi} from "../../../../core/models/response-entity-api";
import {ReregisterModalComponent} from "../../components/reregister-modal/reregister-modal.component";
import {
  ConfirmDeleteModalComponent
} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {MemberStateService} from "../../services/member.state.service";
import {SendMessageModalComponent} from "../../components/member-list/send-message-modal/send-message-modal.component";
import {ExportModalComponent} from "../../components/member-list/export-modal/export-modal.component";
import {SessionModel} from "../../../../core/models/session.model";
import {ContributionService} from "../../../contribution/services/contribution.service";
import {YearOfSessionService} from "../../../../core/services/year-of-session.service";
import {ContributionCalendarItem} from "../../../../core/models/contribution-calendar-item.model";
import {RecordPaymentModalComponent} from "../../components/record-payment-modal/record-payment-modal.component";
import {NotificationService} from "../../../../core/services/notification.service";
import {ToDatePipe} from "../../../../shared/pipes/to-date.pipe";

interface MonthlyContributionDisplay {
  month: string;
  status: string;
  data: ContributionCalendarItem;
}

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgIf, ReregisterModalComponent, NgForOf, ConfirmDeleteModalComponent, SendMessageModalComponent, ExportModalComponent, NgClass, RecordPaymentModalComponent, ToDatePipe, DatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberHttpService = inject(MemberHttpService);
  private memberStateService = inject(MemberStateService);
  private contributionService = inject(ContributionService);
  private yearOfSessionService = inject(YearOfSessionService);
  private notificationService = inject(NotificationService);
  private location = inject(Location)
  member$!: Observable<MemberDataResponse | undefined>;
  isReregisterModalOpen = false;
  isDeleteModalOpen = false;
  isSendMessageModalOpen = false;
  isExportModalOpen = false;
  isActionsDropdownOpen = false;
  isRecordPaymentModalOpen = false;
  isSidebarCollapsed = false;
  selectedContributions: ContributionCalendarItem[] = [];
  subscriptionYears: number[] = [];
  selectedSubscriptionYear!: number;
  private memberId: string | null = null;
  private sessions: SessionModel[] = [];
  monthlyContributions: MonthlyContributionDisplay[] = [];
  contributionSummary: { totalPaid: number; totalDue: number; completionRate: string; } | null = null;

  get selectedTotalAmount(): number {
    return this.selectedContributions.reduce((sum, item) => sum + (item.amountDue - item.amountPaid), 0);
  }

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.member$ = this.memberHttpService.getMemberById(this.memberId).pipe(
        map((response: ResponseEntityApi<MemberDataResponse>) => response.data)
      );

      forkJoin({
        allSessions: this.yearOfSessionService.getYears(),
        currentSession: this.yearOfSessionService.getCurrentYear()
      }).subscribe(({allSessions, currentSession}) => {
        this.sessions = allSessions.data;
        this.subscriptionYears = this.sessions.map(s => s.session).sort((a, b) => b - a);
        this.selectedSubscriptionYear = currentSession.data.session;
        this.loadContributions(this.selectedSubscriptionYear);
      });
    }
  }

  // --- Modal Toggle Methods ---

  toggleDeleteModal(): void {
    this.isDeleteModalOpen = !this.isDeleteModalOpen;
  }

  toggleReregisterModal(): void {
    this.isReregisterModalOpen = !this.isReregisterModalOpen;
  }

  openSendMessageModal(): void {
    if (!this.memberId) return;
    this.memberStateService.clearSelection();
    this.memberStateService.toggleMemberSelection(this.memberId);
    this.isSendMessageModalOpen = true;
  }

  closeSendMessageModal(): void {
    this.isSendMessageModalOpen = false;
    this.memberStateService.clearSelection();
  }

  openExportModal(): void {
    if (!this.memberId) return;
    this.memberStateService.clearSelection();
    this.memberStateService.toggleMemberSelection(this.memberId);
    this.isExportModalOpen = true;
  }

  closeExportModal(): void {
    this.isExportModalOpen = false;
    this.memberStateService.clearSelection();
  }

  toggleActionsDropdown(event: Event): void {
    event.stopPropagation();
    this.isActionsDropdownOpen = !this.isActionsDropdownOpen;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isActionsDropdownOpen = false;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onYearChange(event: Event): void {
    const selectedYear = (event.target as HTMLSelectElement).value;
    this.selectedSubscriptionYear = Number(selectedYear);
    this.selectedContributions = []; // Clear selection on year change
    this.loadContributions(this.selectedSubscriptionYear);
  }

  // --- Action Handlers ---

  loadContributions(year: number): void {
    if (!this.memberId) return;

    const session = this.sessions.find(s => s.session === year);
    if (!session) {
      console.error(`Session ID for year ${year} not found.`);
      this.monthlyContributions = [];
      this.contributionSummary = null;
      return;
    }
    const sessionId = session.id;

    this.contributionService.getContributionCalendar(this.memberId, sessionId).subscribe(response => {
      const contributions = response.data || [];

      // Map to display model
      this.monthlyContributions = contributions.map(contribution => {
        const monthName = new Date(contribution.month[0], contribution.month[1] - 1).toLocaleString('fr-FR', {month: 'short'});
        return {
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1, 4),
          status: this.mapContributionStatusToCssClass(contribution.status),
          data: contribution
        };
      }).sort((a, b) => a.data.month[1] - b.data.month[1]); // Ensure months are sorted

      // Calculate summary
      this.calculateSummary(contributions);
    });
  }

  private calculateSummary(contributions: ContributionCalendarItem[]): void {
    const applicableContributions = contributions.filter(c => c.status !== 'NOT_APPLICABLE');
    const totalPaid = applicableContributions.reduce((sum, c) => sum + c.amountPaid, 0);
    const totalDue = applicableContributions.reduce((sum, c) => c.status !== 'PAID' ? sum + (c.amountDue - c.amountPaid) : sum, 0);
    const paidCount = applicableContributions.filter(c => c.status === 'PAID').length;
    const totalCount = applicableContributions.length;

    this.contributionSummary = {
      totalPaid,
      totalDue,
      completionRate: `${paidCount}/${totalCount} mois`
    };
  }

  private mapContributionStatusToCssClass(status: ContributionCalendarItem['status']): string {
    switch (status) {
      case 'PAID':
        return 'paid';
      case 'DELAYED':
        return 'delayed';
      case 'PENDING':
        return 'pending';
      case 'NOT_APPLICABLE':
        return 'not-applicable';
      default:
        return 'unpaid'; // Fallback, though should not happen
    }
  }

  onMonthClick(contribution: MonthlyContributionDisplay): void {
    const underlyingContribution = contribution.data;
    if (underlyingContribution.status === 'PAID' || underlyingContribution.status === 'NOT_APPLICABLE') {
      return; // Do not select paid or N/A months
    }

    const index = this.selectedContributions.findIndex(c => c.id === underlyingContribution.id);
    if (index > -1) {
      this.selectedContributions.splice(index, 1); // Deselect
    } else {
      this.selectedContributions.push(underlyingContribution); // Select
    }
  }

  isMonthSelected(contribution: MonthlyContributionDisplay): boolean {
    return this.selectedContributions.some(c => c.id === contribution.data.id);
  }

  openRecordPaymentModal(): void {
    if (this.selectedContributions.length > 0) {
      this.isRecordPaymentModalOpen = true;
    }
  }

  handleClosePaymentModal(): void {
    this.isRecordPaymentModalOpen = false;
  }

  handleSavePayment(paymentData: { contributionsID: string[], payementMethode: string }): void {
    this.contributionService.recordPayment(paymentData).subscribe({
      next: () => {
        this.notificationService.showSuccess(`${paymentData.contributionsID.length} mois payés avec succès.`);
        this.selectedContributions = []; // Clear selection
        this.loadContributions(this.selectedSubscriptionYear);
        this.handleClosePaymentModal();
      },
      error: (err) => {
        this.notificationService.showError("Échec de l'enregistrement du paiement.");
        console.error('Failed to record payment', err);
      }
    });
  }


  handleSaveRegistration(formData: any): void {
    if (!this.memberId) return;
    const registrationPayload = {...formData, member: this.memberId};
    this.memberHttpService.register(registrationPayload).subscribe({
      next: () => {
        this.notificationService.showSuccess("Réinscription réussie.");
        // TODO: Refresh data without full reload if possible
        this.loadContributions(this.selectedSubscriptionYear);
      },
      error: (err) => {
        this.notificationService.showError("Échec de la réinscription.");
        console.error('Registration failed', err);
      }
    });
  }

  onDeleteConfirmed(): void {
    if (!this.memberId) return;
    this.memberHttpService.deleteMember(this.memberId).subscribe({
      next: () => {
        this.toggleDeleteModal();
        this.notificationService.showSuccess("Membre supprimé avec succès.");
        this.router.navigate(['/members/list-members']);
      },
      error: (err) => {
        this.toggleDeleteModal();
        this.notificationService.showError("Échec de la suppression du membre.");
        console.error('Failed to delete member', err);
      }
    });
  }

  markAsPaid(session: number): void {
    if (!this.memberId) return;

    console.log(`Simulating marking session ${session} as paid for member ${this.memberId}.`);

    // TODO: Replace with actual HTTP call to a service.
    // For now, we simulate success and update the local data.
    this.member$ = this.member$.pipe(
      map(member => {
        if (!member) return undefined;

        const updatedRegistrations = member.registration.map(reg => {
          if (reg.session === session) {
            return {...reg, statusPayment: true};
          }
          return reg;
        });

        return {...member, registration: updatedRegistrations};
      })
    );
  }

  sendContributionReminder(): void {
    // TODO: Implement actual logic
    // 1. Get list of unpaid months for the selected year.
    // 2. If there are unpaid months, call a service to send an SMS.
    console.log(`Sending contribution reminder for member ${this.memberId} for the session starting in ${this.selectedSubscriptionYear}.`);
  }

  objectToArray(obj: any): { key: string, value: any }[] {
    if (!obj) {
      return [];
    }
    return Object.keys(obj).map(key => ({key, value: obj[key]}));
  }

  goBack() {
    this.location.back();
  }
}
