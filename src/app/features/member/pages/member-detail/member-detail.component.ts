import {Component, HostListener, inject, OnInit} from '@angular/core';
import {AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MemberHttpService} from "../../services/member.http.service";
import {MemberModel} from "../../../../core/models/member.model";
import {forkJoin, map, Observable} from "rxjs";
import {ResponseEntityApi} from "../../../../core/models/response-entity-api";
import {InfoSectionComponent} from "../../../../shared/components/info-section/info-section.component";
import {ReregisterModalComponent} from "../../components/reregister-modal/reregister-modal.component";
import {ConfirmDeleteModalComponent} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {MemberStateService} from "../../services/member.state.service";
import {SendMessageModalComponent} from "../../components/member-list/send-message-modal/send-message-modal.component";
import {ExportModalComponent} from "../../components/member-list/export-modal/export-modal.component";
import {FormatKeyPipe} from "../../../../shared/pipes/format-key.pipe";
import {DatePipe} from "@angular/common";
import {ToDatePipe} from "../../../../shared/pipes/to-date.pipe";
import {SessionModel} from "../../../../core/models/session.model";
import {MonthDataModel} from "../../../../core/models/month-data.model";
import {ContributionService} from "../../../contribution/services/contribution.service";
import {YearOfSessionService} from "../../../../core/services/year-of-session.service";

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [AsyncPipe, NgIf, InfoSectionComponent, ReregisterModalComponent, NgForOf, ConfirmDeleteModalComponent, SendMessageModalComponent, ExportModalComponent, FormatKeyPipe, DatePipe, ToDatePipe, NgSwitch, NgClass, NgSwitchCase, NgSwitchDefault],
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

  member$!: Observable<MemberModel | undefined>;
  isReregisterModalOpen = false;
  isDeleteModalOpen = false;
  isSendMessageModalOpen = false;
  isExportModalOpen = false;
  isActionsDropdownOpen = false;
  subscriptionYears = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];
  selectedSubscriptionYear = new Date().getFullYear();
  private memberId: string | null = null;
  private sessions: SessionModel[] = [];
  private allMonths: MonthDataModel[] = [];
  monthlyContributions: { month: string, monthId: string, status: 'paid' | 'unpaid' }[] = [];

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.member$ = this.memberHttpService.getMemberById(this.memberId).pipe(
        map((response: ResponseEntityApi<MemberModel>) => response.data)
      );

      forkJoin({
        allSessions: this.yearOfSessionService.getYears(),
        currentSession: this.yearOfSessionService.getCurrentYear(),
        months: this.yearOfSessionService.getElevenMonths()
      }).subscribe(({ allSessions, currentSession, months }) => {
        this.sessions = allSessions.data;
        this.allMonths = months.data;

        // Populate dropdown with all available years
        this.subscriptionYears = this.sessions.map(s => s.session).sort((a, b) => b - a);

        // Set the selected year directly from the dedicated service call
        this.selectedSubscriptionYear = currentSession.data.session;

        // Load contributions for the current year
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

  onYearChange(event: Event): void {
    const selectedYear = (event.target as HTMLSelectElement).value;
    this.selectedSubscriptionYear = Number(selectedYear);
    console.log(`Subscription year changed to: ${this.selectedSubscriptionYear}.`);
    // TODO: Add logic to refetch subscription data for the selected year.
  }

  // --- Action Handlers ---

  loadContributions(year: number): void {
    if (!this.memberId) return;

    const session = this.sessions.find(s => s.session === year);
    if (!session) {
      console.error(`Session ID for year ${year} not found.`);
      this.monthlyContributions = []; // Clear contributions
      return;
    }
    const sessionId = session.id;

    this.contributionService.getContributionsByMemberAndSession(this.memberId, sessionId).subscribe(response => {
      const paidContributions = response.data || [];
      // Map all months to a new array with status
      this.monthlyContributions = this.allMonths.map(month => {
        const isPaid = paidContributions.some(c => c.monthId === month.id);
        return {
          month: month.monthName.substring(0, 4),
          monthId: month.id,
          status: isPaid ? 'paid' : 'unpaid'
        };
      });
    });
  }

  handleSaveRegistration(formData: any): void {
    if (!this.memberId) return;
    const registrationPayload = { ...formData, member: this.memberId };
    this.memberHttpService.register(registrationPayload).subscribe({
      next: () => console.log('Registration successful'), // TODO: Refresh data
      error: (err) => console.error('Registration failed', err)
    });
  }

  onDeleteConfirmed(): void {
    if (!this.memberId) return;
    this.memberHttpService.deleteMember(this.memberId).subscribe({
      next: () => {
        this.toggleDeleteModal();
        this.router.navigate(['/members/list-members']);
      },
      error: (err) => {
        console.error('Failed to delete member', err);
        this.toggleDeleteModal();
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
            return { ...reg, statusPayment: true };
          }
          return reg;
        });

        return { ...member, registration: updatedRegistrations };
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
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }
}
