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
import {combineLatest, filter, map, Observable, of, shareReplay, take} from "rxjs";
import {PhaseStatus} from "../../../../core/models/phaseStatus.enum";
import {ReregisterModalComponent} from "./reregister-modal/reregister-modal.component";
import {
  ConfirmDeleteModalComponent
} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {MemberStateService} from "../../services/member.state.service";
import {SendMessageModalComponent} from "../../components/member-list/send-message-modal/send-message-modal.component";
import {ExportModalComponent} from "../../components/member-list/export-modal/export-modal.component";
import {ContributionService} from "../../../contribution/services/contribution.service";
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
import {ContributionCalendarComponent} from "../../components/contribution-calendar/contribution-calendar.component";
import {
  ContributionData,
  ContributionMonth,
  ContributionYear
} from "../../../../core/models/contribution-data.model";
import {PeriodeMandatDto} from "../../../configuration/periode-mandat/models/periode-mandat.model";
import {PhaseModel} from "../../../configuration/periode-mandat/models/phase.model";
import {RegistrationModel} from "../../../../core/models/RegistrationModel";
import {SearchParams} from "../../../../core/models/SearchParams";
import {FormSchemaService} from "../../../../core/services/form-schema.service";
import {FormSchema} from "../../../../core/models/form-schema.model";
import {DynamicFormComponent} from "../../../../shared/components/dynamic-form/dynamic-form.component";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgIf, ReregisterModalComponent, NgForOf, ConfirmDeleteModalComponent, SendMessageModalComponent, ExportModalComponent, NgClass, RecordPaymentModalComponent, ToDatePipe, DatePipe, EditPersonalInfoModalComponent, EditContactInfoModalComponent, EditAcademicInfoModalComponent, EditEngagementsModalComponent, EditReligiousKnowledgeModalComponent, EditAddressInfoModalComponent, EditBourseInfoModalComponent, NgSwitch, NgSwitchCase, ContributionCalendarComponent, DynamicFormComponent, FormsModule],
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

  // Mobile Segmented Tab state
  activeMobileTab: 'profile' | 'contributions' | 'timeline' = 'profile';

  // Fee payment modal
  isPayFeeModalOpen = false;
  selectedRegistrationForFee: RegistrationModel | null = null;
  feeAmount: number = 2000;
  feePaymentMethod: string = 'CASH';
  feeNotes: string = '';
  isSubmittingFee = false;
  isReceiptModalOpen = false;
  receiptRegistration: RegistrationModel | null = null;

  // Full Member Dynamic Form Edit
  isEditFullMemberModalOpen = false;
  fullMemberSchema: FormSchema | null = null;
  prefilledMemberValues: Record<string, any> = {};
  isUpdatingMember = false;

  // Contribution data
  contributionData: ContributionData | null = null;
  selectedContributions: ContributionMonth[] = [];
  contributionSummary: { totalPaid: number; totalDue: number; completionRate: string; } | null = null;

  currentMember: MemberDataResponse | null = null;
  selectedPhaseId: string | null = null;
  availableMandats: PeriodeMandatDto[] = [];
  activeMandat: PeriodeMandatDto | null = null;
  searchParamsForExport: Partial<SearchParams> = {}; // Initialize here
  appStateService = inject(AppStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberHttpService = inject(MemberHttpService);
  private formSchemaService = inject(FormSchemaService);
  private memberStateService = inject(MemberStateService);
  private contributionService = inject(ContributionService);
  private notificationService = inject(NotificationService);
  private location = inject(Location)
  private memberId: string | null = null;

  get selectedTotalAmount(): number {
    return this.selectedContributions.reduce((sum, item) => sum + (item.montantDu - item.montantPaye), 0);
  }

  setActiveMobileTab(tab: 'profile' | 'contributions' | 'timeline'): void {
    this.activeMobileTab = tab;
  }

  getInitials(firstname?: string, name?: string): string {
    const f = (firstname || '').trim().charAt(0);
    const n = (name || '').trim().charAt(0);
    return (f + n).toUpperCase() || 'M';
  }

  getAvatarColor(name?: string): { bg: string, color: string } {
    const colors = [
      { bg: '#e0f2fe', color: '#0369a1' }, // Blue
      { bg: '#fef3c7', color: '#b45309' }, // Amber
      { bg: '#dcfce7', color: '#15803d' }, // Green
      { bg: '#f0fdfa', color: '#0f766e' }, // Teal
      { bg: '#ede9fe', color: '#6d28d9' }, // Purple
      { bg: '#fee2e2', color: '#b91c1c' }, // Red
      { bg: '#ffedd5', color: '#c2410c' }  // Orange
    ];
    const charCode = (name || 'A').charCodeAt(0);
    return colors[charCode % colors.length];
  }

  getStatusBadge(member: MemberDataResponse): { label: string, cssClass: string, icon: string } {
    if (member.status === 'ALUMNI' || (!member.isStudent && member.academicInfo?.studiesDomain === 'Alumni')) {
      return { label: 'Alumni / Diplômé', cssClass: 'badge-alumni', icon: 'bi-briefcase-fill' };
    }
    if (member.status === 'INACTIVE') {
      return { label: 'Inactif', cssClass: 'badge-inactive', icon: 'bi-pause-circle-fill' };
    }
    return { label: 'Étudiant Actif', cssClass: 'badge-active', icon: 'bi-mortarboard-fill' };
  }

  isAlumni(member?: MemberDataResponse): boolean {
    if (!member) return false;
    return member.status === 'ALUMNI' || Boolean(member.alumniProfile) || member.isStudent === false;
  }

  getWhatsAppUrl(phone?: string): string {
    if (!phone) return '#';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length === 9 && !clean.startsWith('221')) {
      clean = '221' + clean;
    }
    return `https://wa.me/${clean}`;
  }

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.searchParamsForExport = { keyword: this.memberId }; // Set it here
      this.loadData();
    } else {
      this.notificationService.showError("ID de membre manquant.");
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


  // --- Other Modal Toggle Methods ---

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
    this.isExportModalOpen = true;
  }

  closeExportModal(): void {
    this.isExportModalOpen = false;
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

  onPhaseChange(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedPhaseId = selectedId;
    this.selectedContributions = [];
    if (this.selectedPhaseId) {
      this.loadContributionData(this.selectedPhaseId);
    }
  }

  loadContributionData(phaseId: string): void {
    if (!this.memberId) return;

    this.contributionService.getContributionCalendar(this.memberId, phaseId)
      .pipe(map(response => response.data))
      .subscribe({
        next: (data) => {
          this.contributionData = data;
          this.calculateSummary(data);
        },
        error: (err) => {
          console.error('Failed to load contribution data', err);
          this.notificationService.showError("Échec du chargement des cotisations.");
        }
      });
  }

  handleMonthClick(month: ContributionMonth): void {
    const index = this.selectedContributions.findIndex(c => c.idContribution === month.idContribution);
    if (index > -1) {
      this.selectedContributions.splice(index, 1); // Deselect
    } else {
      this.selectedContributions.push(month); // Select
    }
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
          this.loadContributionData(this.selectedPhaseId);
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

  private loadData(): void {
    if (!this.memberId) return;

    // 1. Charger immédiatement le membre pour affichage direct
    this.memberHttpService.getMemberById(this.memberId).subscribe({
      next: (res) => {
        const member = res.data;
        if (!member) {
          this.notificationService.showError("Membre non trouvé.");
          this.router.navigate(['/members/list-members']);
          return;
        }
        this.currentMember = member;
        this.member$ = of(member);
        this.loadTimelineAndOverview();
      },
      error: (err) => {
        this.notificationService.showError("Impossible de charger les informations du membre.");
        console.error('Failed to load member', err);
      }
    });

    // 2. Charger les mandats disponibles
    this.appStateService.mandats$.pipe(
      filter(mandats => mandats.length > 0),
      take(1)
    ).subscribe(mandats => {
      this.availableMandats = mandats;
    });

    // 3. Charger le mandat actif et le calendrier des cotisations
    this.appStateService.activeMandat$.pipe(
      filter((m): m is PeriodeMandatDto => m !== null),
      take(1)
    ).subscribe(activeMandat => {
      this.activeMandat = activeMandat;
      const activePhaseInMandate = activeMandat.phases?.find(p => p.status === PhaseStatus.CURRENT);

      if (activePhaseInMandate) {
        this.selectedPhaseId = activePhaseInMandate.id;
        this.loadContributionData(activePhaseInMandate.id);
      } else if (activeMandat.phases && activeMandat.phases.length > 0) {
        const fallbackPhase = activeMandat.phases[0];
        this.selectedPhaseId = fallbackPhase.id;
        this.loadContributionData(fallbackPhase.id);
      }
    });
  }

  private loadTimelineAndOverview(): void {
    if (!this.memberId) return;

    const timeline$ = this.memberHttpService.getMemberRegistrationTimeline(this.memberId).pipe(shareReplay(1));
    this.timeline$ = timeline$;

    timeline$.pipe(take(1)).subscribe(timeline => {
      this.registrationOverview = this.buildRegistrationOverview(timeline);
    });
  }

  private calculateSummary(data: ContributionData): void {
    const allMonths = data.calendrier.flatMap(y => y.mois);
    const applicableContributions = allMonths.filter(c => c.status !== 'NOT_APPLICABLE');

    const totalPaid = applicableContributions.reduce((sum, c) => sum + c.montantPaye, 0);
    const totalDue = applicableContributions.reduce((sum, c) => c.status !== 'PAID' ? sum + (c.montantDu - c.montantPaye) : sum, 0);
    const paidCount = applicableContributions.filter(c => c.status === 'PAID').length;
    const totalCount = applicableContributions.length;

    this.contributionSummary = {
      totalPaid,
      totalDue,
      completionRate: `${paidCount}/${totalCount} mois`
    };
  }

  private buildRegistrationOverview(timeline: MandateTimelineItem[]): RegistrationOverview {
    let latest: RegistrationModel | null = null;
    let nextPhase: PhaseModel | null = null;

    for (const item of timeline) {
      for (const phaseItem of item.phases) {
        if (phaseItem.registration) {
          if (!latest || new Date(phaseItem.registration.dateInscription) > new Date(latest.dateInscription)) {
            latest = phaseItem.registration;
          }
        }

        if (!nextPhase && phaseItem.isRegistrable) {
          nextPhase = phaseItem.phase;
        }
      }
    }

    return {
      latestRegistration: latest,
      nextRegistrablePhase: nextPhase,
    };
  }

  formatArrayDate(dateArray: number[]): string {
    if (!dateArray) return '';
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // --- Dynamic Form Full Member Edition ---
  openEditFullMemberModal(): void {
    if (!this.currentMember) return;
    this.formSchemaService.getFormSchema().subscribe({
      next: (res) => {
        this.fullMemberSchema = res;
        this.buildPrefilledValues();
        this.isEditFullMemberModalOpen = true;
      },
      error: (err) => {
        this.notificationService.showError("Impossible de charger le schéma du formulaire.");
        console.error('Failed to load schema', err);
      }
    });
  }

  closeEditFullMemberModal(): void {
    this.isEditFullMemberModalOpen = false;
  }

  private buildPrefilledValues(): void {
    if (!this.currentMember) return;
    const m = this.currentMember;

    let birthdayStr = '';
    if (m.personalInfo?.birthday && Array.isArray(m.personalInfo.birthday)) {
      const [y, mon, d] = m.personalInfo.birthday;
      birthdayStr = `${y}-${String(mon).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    this.prefilledMemberValues = {
      firstname: m.personalInfo?.firstname || '',
      name: m.personalInfo?.name || '',
      nationality: m.personalInfo?.nationality || 'Sénégalaise',
      gender: m.personalInfo?.gender || '',
      birthday: birthdayStr,
      maritalStatus: m.personalInfo?.maritalStatus || 'SINGLE',
      email: m.contactInfo?.email || '',
      numberPhone: m.contactInfo?.numberPhone || '',
      addressInDakar: m.addressInfo?.addressInDakar || '',
      addressToCampus: m.addressInfo?.addressToCampus || '',
      isStudent: m.status !== 'ALUMNI',
      institutionName: m.academicInfo?.institutionName || '',
      studiesDomain: m.academicInfo?.studiesDomain || '',
      studiesLevel: m.academicInfo?.studiesLevel || '',
      bourseId: m.bourse?.libelle || '',
      bacSeries: m.membershipInfo?.bacSeries || '',
      bacMention: m.membershipInfo?.bacMention || '',
      yearOfBac: m.membershipInfo?.yearOfBac || '',
      legacyInstitution: m.membershipInfo?.legacyInstitution || '',
      arabicProficiency: m.religiousKnowledge?.arabicProficiency || '',
      coranLevel: m.religiousKnowledge?.coranLevel || '',
      currentProfession: m.alumniProfile?.currentProfession || '',
      companyOrInstitution: m.alumniProfile?.companyOrInstitution || '',
      industrySector: m.alumniProfile?.industrySector || '',
      promotionYear: m.alumniProfile?.promotionYear || '',
      lastDegreeObtained: m.alumniProfile?.lastDegreeObtained || '',
      residenceCity: m.alumniProfile?.residenceCity || '',
      residenceCountry: m.alumniProfile?.residenceCountry || '',
      supportTypes: m.alumniProfile?.supportTypes || [],
      ...(m.dynamicAttributes || {})
    };
  }

  formatSupportType(type: string): string {
    const map: Record<string, string> = {
      'FINANCIAL_DONATION': 'Soutien & Don Financier',
      'ACADEMIC_MENTORING': 'Mentorat Académique',
      'JOB_INTERNSHIP_SHARING': 'Offres d\'Emploi & Stages',
      'CONFERENCE_SPEAKER': 'Animation de Conférences / Formations',
      'EVENT_PARTICIPATION': 'Participation aux Événements'
    };
    return map[type] || type;
  }

  handleFullMemberSave(formData: Record<string, any>): void {
    if (!this.memberId) return;
    this.isUpdatingMember = true;

    const isAlumni = !formData['isStudent'] || this.currentMember?.status === 'ALUMNI';

    const updatePayload: any = {
      id: this.memberId,
      personalInfo: {
        firstname: formData['firstname'],
        name: formData['name'],
        nationality: formData['nationality'],
        gender: formData['gender'],
        birthday: formData['birthday'],
        maritalStatus: formData['maritalStatus']
      },
      contactInfo: {
        email: formData['email'],
        numberPhone: formData['numberPhone'],
        personToCalls: this.currentMember?.contactInfo?.personToCalls || []
      },
      addressInfo: {
        addressInDakar: formData['addressInDakar'],
        addressToCampus: formData['addressToCampus']
      },
      academicInfo: {
        institutionName: formData['institutionName'],
        studiesDomain: formData['studiesDomain'],
        studiesLevel: formData['studiesLevel']
      },
      membershipInfo: {
        legacyInstitution: formData['legacyInstitution'],
        bacSeries: formData['bacSeries'],
        bacMention: formData['bacMention'],
        yearOfBac: formData['yearOfBac'],
        aemudCourses: formData['aemudCourses'],
        otherCourses: formData['otherCourses'],
        participatedActivity: formData['participatedActivity'],
        politicOrganisation: formData['politicOrganisation']
      },
      religiousKnowledge: {
        arabicProficiency: formData['arabicProficiency'],
        coranLevel: formData['coranLevel'],
        aqida: this.currentMember?.religiousKnowledge?.aqida || [],
        fiqh: this.currentMember?.religiousKnowledge?.fiqh || []
      },
      alumniProfile: isAlumni ? {
        currentProfession: formData['currentProfession'] || this.currentMember?.alumniProfile?.currentProfession,
        companyOrInstitution: formData['companyOrInstitution'] || this.currentMember?.alumniProfile?.companyOrInstitution,
        industrySector: formData['industrySector'] || this.currentMember?.alumniProfile?.industrySector,
        promotionYear: formData['promotionYear'] || this.currentMember?.alumniProfile?.promotionYear,
        lastDegreeObtained: formData['lastDegreeObtained'] || this.currentMember?.alumniProfile?.lastDegreeObtained,
        residenceCity: formData['residenceCity'] || this.currentMember?.alumniProfile?.residenceCity,
        residenceCountry: formData['residenceCountry'] || this.currentMember?.alumniProfile?.residenceCountry,
        supportTypes: formData['supportTypes'] || this.currentMember?.alumniProfile?.supportTypes || []
      } : null,
      bourse: formData['bourseId'] || this.currentMember?.bourse?.id,
      clubs: this.currentMember?.clubs?.map(c => c.id) || [],
      commissions: this.currentMember?.commissions?.map(c => c.id) || []
    };

    this.memberHttpService.updateMember(updatePayload).subscribe({
      next: () => {
        this.isUpdatingMember = false;
        this.notificationService.showSuccess("Fiche membre mise à jour avec succès.");
        this.closeEditFullMemberModal();
        this.loadData();
      },
      error: (err) => {
        this.isUpdatingMember = false;
        this.notificationService.showError("Erreur lors de la mise à jour du membre.");
        console.error('Update member failed', err);
      }
    });
  }

  hasDynamicAttributes(member: MemberDataResponse): boolean {
    return !!member.dynamicAttributes && Object.keys(member.dynamicAttributes).length > 0;
  }

  getDynamicAttributeEntries(member: MemberDataResponse): { key: string, value: any }[] {
    if (!member.dynamicAttributes) return [];
    return Object.entries(member.dynamicAttributes).map(([key, value]) => ({
      key,
      value: typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : Array.isArray(value) ? value.join(', ') : value
    }));
  }

  // --- REGISTRATION FEE PAYMENT ---
  openPayFeeModal(registration: RegistrationModel): void {
    this.selectedRegistrationForFee = registration;
    this.feeAmount = registration.registrationType === 'INITIAL' ? 2000 : 1000;
    this.feePaymentMethod = 'CASH';
    this.feeNotes = '';
    this.isPayFeeModalOpen = true;
  }

  closePayFeeModal(): void {
    this.isPayFeeModalOpen = false;
    this.selectedRegistrationForFee = null;
  }

  submitPayFee(): void {
    if (!this.selectedRegistrationForFee) return;

    this.isSubmittingFee = true;
    const payload = {
      amount: this.feeAmount,
      paymentMethod: this.feePaymentMethod,
      notes: this.feeNotes
    };

    this.memberHttpService.payRegistrationFee(this.selectedRegistrationForFee.id, payload).subscribe({
      next: (res) => {
        this.isSubmittingFee = false;
        this.notificationService.showSuccess("Frais d'adhésion enregistrés avec succès !");
        this.closePayFeeModal();
        if (res.data) {
          this.openReceiptModal(res.data);
        }
        this.loadData();
      },
      error: (err) => {
        this.isSubmittingFee = false;
        this.notificationService.showError("Erreur lors de l'enregistrement du paiement.");
        console.error('Pay fee failed', err);
      }
    });
  }

  openReceiptModal(registration: RegistrationModel): void {
    this.receiptRegistration = registration;
    this.isReceiptModalOpen = true;
  }

  closeReceiptModal(): void {
    this.isReceiptModalOpen = false;
    this.receiptRegistration = null;
  }
}

