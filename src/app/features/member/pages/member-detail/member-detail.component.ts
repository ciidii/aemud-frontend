import {Component, HostListener, inject, OnInit} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe, Location, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MemberHttpService} from "../../services/member.http.service";
import {
  AcademicInfoRequest,
  ContactInfoRequest,
  MemberDataResponse,
  MembershipInfo,
  PersonalInfo,
  RegistrationStatus,
  ReligiousKnowledge,
  TypeInscription
} from "../../../../core/models/member-data.model";
import {forkJoin, map, Observable, tap} from "rxjs";
import {ResponseEntityApi} from "../../../../core/models/response-entity-api";
import {ReregisterModalComponent} from "./reregister-modal/reregister-modal.component";
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
import {RecordPaymentModalComponent} from "./record-payment-modal/record-payment-modal.component";
import {NotificationService} from "../../../../core/services/notification.service";
import {ToDatePipe} from "../../../../shared/pipes/to-date.pipe";
import {EditPersonalInfoModalComponent} from "./edit-personal-info-modal/edit-personal-info-modal.component";
import {EditContactInfoModalComponent} from "./edit-contact-info-modal/edit-contact-info-modal.component";
import {
  AcademicAndMembershipData,
  EditAcademicInfoModalComponent
} from "./edit-academic-info-modal/edit-academic-info-modal.component";
import {
  EditEngagementsModalComponent,
  EngagementsData
} from "./edit-engagements-modal/edit-engagements-modal.component";
import {
  EditReligiousKnowledgeModalComponent
} from "./edit-religious-knowledge-modal/edit-religious-knowledge-modal.component";
import {AddressInfo, EditAddressInfoModalComponent} from "./edit-address-info-modal/edit-address-info-modal.component";
import {EditBourseInfoModalComponent} from "./edit-bourse-info-modal/edit-bourse-info-modal.component";
import {BourseModel} from "../../../../core/models/bourse.model";

interface MonthlyContributionDisplay {
  month: string;
  status: string;
  data: ContributionCalendarItem;
}

export interface ProcessedRegistration {
  isCurrentSession: boolean;
  isRegistered: boolean;
  sessionId: string;
  status: RegistrationStatus | null;
  statusPayment: boolean | null;
  registrationType: TypeInscription | null;
}

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgIf, ReregisterModalComponent, NgForOf, ConfirmDeleteModalComponent, SendMessageModalComponent, ExportModalComponent, NgClass, RecordPaymentModalComponent, ToDatePipe, DatePipe, EditPersonalInfoModalComponent, EditContactInfoModalComponent, EditAcademicInfoModalComponent, EditEngagementsModalComponent, EditReligiousKnowledgeModalComponent, EditAddressInfoModalComponent, EditBourseInfoModalComponent],
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
  protected currentSessionYear: SessionModel | null = null;
  member$!: Observable<MemberDataResponse | undefined>;
  isReregisterModalOpen = false;
  isDeleteModalOpen = false;
  isSendMessageModalOpen = false;
  isExportModalOpen = false;
  isActionsDropdownOpen = false;
  isRecordPaymentModalOpen = false;
  isSidebarCollapsed = false;
  isEditPersonalInfoModalOpen = false;
  isEditContactInfoModalOpen = false;
  isEditAcademicInfoModalOpen = false;
  isEditEngagementsModalOpen = false;
  isEditReligiousKnowledgeModalOpen = false;
  isEditAddressInfoModalOpen = false;
  isEditBourseInfoModalOpen = false;
  selectedContributions: ContributionCalendarItem[] = [];
  subscriptionYears: number[] = [];
  selectedSubscriptionYear!: number;
  private memberId: string | null = null;
  protected sessions: SessionModel[] = [];
  monthlyContributions: MonthlyContributionDisplay[] = [];
  contributionSummary: { totalPaid: number; totalDue: number; completionRate: string; } | null = null;
  currentMember: MemberDataResponse | null = null;
  academicAndMembershipDataForModal: AcademicAndMembershipData | null = null;

  processedRegistrations: ProcessedRegistration[] = [];
  RegistrationStatus = RegistrationStatus;

  get selectedTotalAmount(): number {
    return this.selectedContributions.reduce((sum, item) => sum + (item.amountDue - item.amountPaid), 0);
  }

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.refreshMemberData();

      forkJoin({
        allSessions: this.yearOfSessionService.getYears(),
        currentSession: this.yearOfSessionService.getCurrentYear()
      }).subscribe(({allSessions, currentSession}) => {
        this.sessions = allSessions.data;
        this.subscriptionYears = this.sessions.map(s => s.session).sort((a, b) => b - a);
        this.selectedSubscriptionYear = currentSession.data.session;
        this.currentSessionYear = currentSession.data;
        this.loadContributions(this.selectedSubscriptionYear);

        if (this.currentMember) {
          this.buildProcessedRegistrations(this.currentMember, this.currentSessionYear);
        }
      });
    }
  }

  // --- Edit Modals Methods ---
  openEditPersonalInfoModal(): void {
    this.isEditPersonalInfoModalOpen = true;
  }

  closeEditPersonalInfoModal(): void {
    this.isEditPersonalInfoModalOpen = false;
  }

  handleSavePersonalInfo(updatedInfo: PersonalInfo): void {
    this.notificationService.showSuccess("Informations personnelles mises à jour (simulation).");
    this.closeEditPersonalInfoModal();
    if (this.currentMember) {
      this.currentMember = {...this.currentMember, personalInfo: updatedInfo};
      this.refreshMemberData();
    }
  }

  openEditContactInfoModal(): void {
    this.isEditContactInfoModalOpen = true;
  }

  closeEditContactInfoModal(): void {
    this.isEditContactInfoModalOpen = false;
  }

  handleSaveContactInfo(updatedInfo: ContactInfoRequest): void {
    this.notificationService.showSuccess("Informations de contact mises à jour (simulation).");
    this.closeEditContactInfoModal();
    if (this.currentMember) {
      this.currentMember = {...this.currentMember, contactInfo: updatedInfo};
      this.refreshMemberData();
    }
  }

  openEditAcademicInfoModal(): void {
    this.isEditAcademicInfoModalOpen = true;
  }

  closeEditAcademicInfoModal(): void {
    this.isEditAcademicInfoModalOpen = false;
  }

  handleSaveAcademicInfo(updatedInfo: AcademicAndMembershipData): void {
    this.notificationService.showSuccess("Informations académiques mises à jour (simulation).");
    this.closeEditAcademicInfoModal();
    if (this.currentMember) {
      const {institutionName, studiesDomain, studiesLevel, ...membershipInfo} = updatedInfo;
      const academicInfo: AcademicInfoRequest = {institutionName, studiesDomain, studiesLevel};

      this.currentMember = {
        ...this.currentMember,
        academicInfo: academicInfo,
        membershipInfo: membershipInfo as MembershipInfo
      };
      this.refreshMemberData();
    }
  }

  openEditEngagementsModal(): void {
    this.isEditEngagementsModalOpen = true;
  }

  closeEditEngagementsModal(): void {
    this.isEditEngagementsModalOpen = false;
  }

  handleSaveEngagements(engagementsData: EngagementsData): void {
    // TODO: Implement actual save logic with a service call
    this.notificationService.showSuccess("Engagements mis à jour (simulation).");
    this.refreshMemberData(); // Refresh data to show changes
  }

  openEditAddressInfoModal(): void {
    this.isEditAddressInfoModalOpen = true;
  }

  closeEditAddressInfoModal(): void {
    this.isEditAddressInfoModalOpen = false;
  }

  handleSaveAddressInfo(updatedInfo: AddressInfo): void {
    this.notificationService.showSuccess("Adresse mise à jour (simulation).");
    this.closeEditAddressInfoModal();
    if (this.currentMember) {
      this.currentMember = {...this.currentMember, addressInfo: updatedInfo};
      this.refreshMemberData();
    }
  }

  openEditBourseInfoModal(): void {
    this.isEditBourseInfoModalOpen = true;
  }

  closeEditBourseInfoModal(): void {
    this.isEditBourseInfoModalOpen = false;
  }

  handleSaveBourseInfo(updatedInfo: BourseModel): void {
    this.notificationService.showSuccess("Bourse mise à jour (simulation).");
    this.closeEditBourseInfoModal();
    if (this.currentMember) {
      this.currentMember = {...this.currentMember, bourse: updatedInfo};
      this.refreshMemberData();
    }
  }

  private refreshMemberData(): void {
    if (!this.memberId) return;
    this.member$ = this.memberHttpService.getMemberById(this.memberId).pipe(
      map((response: ResponseEntityApi<MemberDataResponse>) => response.data),
      tap(member => {
        if (member) {
          this.currentMember = member;
          if (this.currentSessionYear) {
            this.buildProcessedRegistrations(member, this.currentSessionYear);
          }
        }
      })
    );
  }


  // --- Other Modal Toggle Methods ---

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
    console.log(registrationPayload)
    this.memberHttpService.register(registrationPayload).subscribe({
      next: () => {
        this.notificationService.showSuccess("Réinscription réussie.");
        this.refreshMemberData();
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

  markAsPaid(session: string): any {
    if (!this.memberId) return;
    this.member$ = this.member$.pipe(
      map(member => {
        if (!member) return undefined;

        const updatedRegistrations = member.registration.map(reg => {
          if (reg.sessionId === session) {
            console.log({...reg, statusPayment: true})
            this.memberHttpService.updateRegister({...reg, statusPayment: true}).subscribe({
              next: (res) => {
                if (res.status === "OK") {

                }
              },
              error: err => {

              }
            })
          }
          return reg;
        });
        // console.log({registration: updatedRegistrations})
        // return {...member, registration: updatedRegistrations};
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

  get currentSessionRegistration(): ProcessedRegistration | undefined {
    return this.processedRegistrations.find(r => r.isCurrentSession);
  }

  get pastRegistrations(): ProcessedRegistration[] {
    return this.processedRegistrations.filter(r => !r.isCurrentSession);
  }

  getRegistrationStatusClass(reg: ProcessedRegistration): string {
    if (!reg.isRegistered) {
      return 'status-not-registered';
    }
    switch (reg.status) {
      case RegistrationStatus.COMPLETED:
        return 'status-completed';
      case RegistrationStatus.UNCOMPLETED:
        return 'status-uncompleted';
      case RegistrationStatus.EXPIRED:
        return 'status-expired';
      default:
        return '';
    }
  }

  getRegistrationStatusIcon(reg: ProcessedRegistration): string {
    if (!reg.isRegistered) {
      return '<i class="bi bi-x-circle-fill"></i>';
    }
    switch (reg.status) {
      case RegistrationStatus.COMPLETED:
        return '<i class="bi bi-check-circle-fill"></i>';
      case RegistrationStatus.UNCOMPLETED:
        return '<i class="bi bi-exclamation-triangle-fill"></i>';
      case RegistrationStatus.EXPIRED:
        return '<i class="bi bi-slash-circle-fill"></i>';
      default:
        return '';
    }
  }

  getRegistrationStatusText(reg: ProcessedRegistration): string {
    if (!reg.isRegistered) {
      return 'Non inscrit';
    }
    switch (reg.status) {
      case RegistrationStatus.COMPLETED:
        return 'Inscription Complète';
      case RegistrationStatus.UNCOMPLETED:
        return 'Paiement Requis';
      case RegistrationStatus.EXPIRED:
        return 'Inscription Expirée';
      default:
        return 'Statut Inconnu';
    }
  }

  getRegistrationStatusDescription(reg: ProcessedRegistration): string {
    if (!reg.isRegistered) {
      return `Ce membre n'est pas encore inscrit pour la session en cours.`;
    }
    switch (reg.status) {
      case RegistrationStatus.COMPLETED:
        return `L'inscription pour cette session est finalisée et le paiement a été reçu.`;
      case RegistrationStatus.UNCOMPLETED:
        return `L'inscription a été initiée mais le paiement n'a pas encore été confirmé.`;
      case RegistrationStatus.EXPIRED:
        return `L'inscription pour cette session est terminée.`;
      default:
        return 'Aucune information sur le statut de l\'inscription.';
    }
  }

  closeEditReligiousKnowledgeModal() {
    this.isEditReligiousKnowledgeModalOpen = false;
  }

  handleSaveReligiousKnowledge($event: ReligiousKnowledge) {

  }

  openEditReligiousKnowledgeModal() {
    this.isEditReligiousKnowledgeModalOpen = true;
  }

  private buildProcessedRegistrations(member: MemberDataResponse, currentSession: SessionModel): void {
    const registrations = member.registration || [];
    const processed: ProcessedRegistration[] = [];

    // 1. Handle current session
    const currentSessionReg = registrations.find(r => r.sessionId === currentSession.id);
    processed.push({
      isCurrentSession: true,
      isRegistered: !!currentSessionReg,
      sessionId: currentSession.id,
      status: currentSessionReg?.registrationStatus ?? null,
      statusPayment: currentSessionReg?.statusPayment ?? null,
      registrationType: currentSessionReg?.registrationType ?? null
    });

    // 2. Handle past sessions
    const otherRegistrations = registrations
      .filter(r => r.sessionId !== currentSession.id)
      .map(r => ({
        isCurrentSession: false,
        isRegistered: true,
        sessionId: r.sessionId,
        status: r.registrationStatus,
        statusPayment: r.statusPayment,
        registrationType: r.registrationType,
      }));

    // 3. Combine and sort
    this.processedRegistrations = [...processed, ...otherRegistrations]
  }
}
