import {Component, HostListener, inject, OnInit} from '@angular/core';
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  Location,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase
} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MemberHttpService} from "../../services/member.http.service";
import {
  AcademicInfoRequest,
  ContactInfoRequest,
  MemberDataResponse,
  MembershipInfo,
  PersonalInfo,
  ReligiousKnowledge,
} from "../../../../core/models/member-data.model";
import {combineLatest, filter, map, Observable, of, take} from "rxjs";
import {MandatDto} from "../../../../core/models/mandat.model";
import {PhaseStatus} from "../../../../core/models/phaseStatus.enum";
import {ReregisterModalComponent} from "./reregister-modal/reregister-modal.component";
import {
  ConfirmDeleteModalComponent
} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {MemberStateService} from "../../services/member.state.service";
import {SendMessageModalComponent} from "../../components/member-list/send-message-modal/send-message-modal.component";
import {ExportModalComponent} from "../../components/member-list/export-modal/export-modal.component";
import {ContributionService} from "../../../contribution/services/contribution.service";
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
import {AppStateService} from "../../../../core/services/app-state.service";
import {MandateTimelineItem, RegistrationOverview} from "../../../../core/models/timeline.model";
import {PhaseModel} from "../../../../core/models/phase.model";

interface MonthlyContributionDisplay {
  month: string;
  status: string;
  data: ContributionCalendarItem;
}

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgIf, ReregisterModalComponent, NgForOf, ConfirmDeleteModalComponent, SendMessageModalComponent, ExportModalComponent, NgClass, RecordPaymentModalComponent, ToDatePipe, DatePipe, EditPersonalInfoModalComponent, EditContactInfoModalComponent, EditAcademicInfoModalComponent, EditEngagementsModalComponent, EditReligiousKnowledgeModalComponent, EditAddressInfoModalComponent, EditBourseInfoModalComponent, NgSwitch, NgSwitchCase],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  member$!: Observable<MemberDataResponse | undefined>;
  registrationOverview: RegistrationOverview | null = null;
  timeline$!: Observable<MandateTimelineItem[]>;
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
  monthlyContributions: MonthlyContributionDisplay[] = [];
  contributionSummary: { totalPaid: number; totalDue: number; completionRate: string; } | null = null;
  currentMember: MemberDataResponse | null = null;
  selectedPhaseId: string | null = null;
  availableMandats: MandatDto[] = [];
  activeMandat: MandatDto | null = null;
  appStateService = inject(AppStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberHttpService = inject(MemberHttpService);
  private memberStateService = inject(MemberStateService);
  private contributionService = inject(ContributionService);
  private notificationService = inject(NotificationService);
  private location = inject(Location)
  private memberId: string | null = null;

  get selectedTotalAmount(): number {
    return this.selectedContributions.reduce((sum, item) => sum + (item.amountDue - item.amountPaid), 0);
  }

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.loadData();
    } else {
      this.notificationService.showError("ID de membre manquant.");
    }
  }

  private loadData(): void {
    if (!this.memberId) return;

    this.appStateService.mandats$.pipe(
      filter(mandats => mandats.length > 0),
      take(1)
    ).subscribe(mandats => {
      this.availableMandats = mandats;
    });

    combineLatest([
      this.appStateService.activeMandat$.pipe(filter((m): m is MandatDto => m !== null)),
      this.memberHttpService.getMemberById(this.memberId).pipe(map(res => res.data))
    ]).pipe(
      take(1)
    ).subscribe(([activeMandat, member]) => {
      if (!member) {
        this.notificationService.showError("Membre non trouvé.");
        this.router.navigate(['/members/list-members']);
        return;
      }

      this.activeMandat = activeMandat;
      this.currentMember = member;
      this.member$ = of(member);
      this.registrationOverview = member.registrationOverview;
      this.loadTimeline();

      const activePhaseInMandate = activeMandat.phases.find(p => p.status === PhaseStatus.CURRENT);

      if (activePhaseInMandate) {
        this.selectedPhaseId = activePhaseInMandate.id;
        this.loadContributions(activePhaseInMandate.id);
      } else {
        this.notificationService.showWarning("Aucune phase active trouvée dans le mandat actuel.");
        const fallbackPhase = activeMandat.phases[0];
        if (fallbackPhase) {
          this.loadContributions(fallbackPhase.id);
        }
      }
    });
  }

  private loadTimeline(): void {
    if (!this.memberId) return;
    this.timeline$ = this.memberHttpService.getMemberRegistrationTimeline(this.memberId);
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
      this.loadData();
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
      this.loadData();
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
      this.loadData();
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
    this.loadData(); // Refresh data to show changes
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
      this.loadData();
    }
  }

  openEditBourseInfoModal(): void {
    this.isEditBourseInfoModalOpen = true;
  }

  closeEditBourseInfoModal(): void {
    this.isEditBourseInfoModalOpen = false;
  }


  // --- Other Modal Toggle Methods ---

  handleSaveBourseInfo(updatedInfo: BourseModel): void {
    this.notificationService.showSuccess("Bourse mise à jour (simulation).");
    this.closeEditBourseInfoModal();
    if (this.currentMember) {
      this.currentMember = {...this.currentMember, bourse: updatedInfo};
      this.loadData();
    }
  }

  toggleDeleteModal(): void {
    this.isDeleteModalOpen = !this.isDeleteModalOpen;
  }

  toggleReregisterModal(phase?: PhaseModel): void {
    // TODO: Prefill the modal with the phase if provided
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

  // --- Action Handlers ---

  onPhaseChange(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedPhaseId = selectedId;
    this.selectedContributions = [];
    if (this.selectedPhaseId) {
      this.loadContributions(this.selectedPhaseId);
    }
  }

  loadContributions(phaseId: string): void {
    if (!this.memberId) return;

    this.contributionService.getContributionCalendar(this.memberId, phaseId).subscribe(response => {
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
        if (this.selectedPhaseId) {
          this.loadContributions(this.selectedPhaseId);
        }
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
    const registrationPayload = {...formData, memberId: this.memberId};
    this.memberHttpService.register(registrationPayload).subscribe({
      next: () => {
        this.notificationService.showSuccess("Réinscription réussie.");
        this.loadData();
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

  sendContributionReminder(): void {
    // TODO: Implement actual logic
    console.log(`Sending contribution reminder for member ${this.memberId} for the phase ${this.selectedPhaseId}.`);
  }

  goBack() {
    this.location.back();
  }

  closeEditReligiousKnowledgeModal() {
    this.isEditReligiousKnowledgeModalOpen = false;
  }

  handleSaveReligiousKnowledge($event: ReligiousKnowledge) {
    // TODO: Implement save logic
    this.notificationService.showSuccess("Connaissances religieuses mises à jour (simulation).");
    this.loadData();
  }

  openEditReligiousKnowledgeModal() {
    this.isEditReligiousKnowledgeModalOpen = true;
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
        return 'unpaid';
    }
  }
}
