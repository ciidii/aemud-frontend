import {Component, inject, OnInit} from '@angular/core';
import {TableHeaderComponent} from "./table-header/table-header.component";
import {TableBodyComponent} from "./table-body/table-body.component";
import {TableFooterComponent} from "./table-footer/table-footer.component";
import {MemberStateService} from "../../services/member.state.service";
import {combineLatest, filter, map, Observable, switchMap, take} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {ExportModalComponent} from './export-modal/export-modal.component';
import {SendMessageModalComponent} from "./send-message-modal/send-message-modal.component";
import {TableFiltersComponent} from "./table-filters/table-filters.component";
import {FilterPanelComponent} from "./filter-panel/filter-panel.component";
import {
  ConfirmDeleteModalComponent
} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {MemberDataResponse} from "../../../../core/models/member-data.model";
import {AppStateService} from "../../../../core/services/app-state.service";
import {PhaseStatus} from "../../../../core/models/phaseStatus.enum";
import {ActivatedRoute, Router} from "@angular/router";
import {PhaseHttpService} from "../../../periode-mandat/services/phase-http.service";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    TableHeaderComponent,
    TableBodyComponent,
    TableFooterComponent,
    AsyncPipe,
    NgIf,
    ExportModalComponent,
    SendMessageModalComponent,
    FilterPanelComponent,
    TableFiltersComponent,
    ConfirmDeleteModalComponent
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {
  members$: Observable<MemberDataResponse[]>;
  loading$: Observable<boolean>;
  selectedMembersCount$: Observable<number>;
  hasSelection$: Observable<boolean>;
  isExportModalOpen = false;
  isSendMessageModalOpen = false;
  isFilterPanelOpen = false;
  isDeleteModalOpen = false;
  recipientNumbers: string[] = [];
  isSmsSelectMode = false;

  private memberStateService = inject(MemberStateService);
  private appStateService = inject(AppStateService);
  private phaseService = inject(PhaseHttpService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.members$ = this.memberStateService.paginatedMembers$;
    this.loading$ = this.memberStateService.loading$;
    this.selectedMembersCount$ = this.memberStateService.selectedMembersCount$;
    this.hasSelection$ = this.memberStateService.hasSelection$;
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      this.isSmsSelectMode = params.get('smsSelect') === 'true';
      if (this.isSmsSelectMode) {
        this.memberStateService.clearSelection();
      }
    });

    this.appStateService.activeMandat$.pipe(
      filter(mandat => mandat !== null),
      take(1),
      switchMap(mandat => {
        const activeMandat = mandat!;
        return this.phaseService.getMandatPhases(activeMandat.id).pipe(
          map(phases => {
            const activePhase = phases.find(p => p.status === PhaseStatus.CURRENT);
            return {activeMandat, activePhase};
          })
        );
      })
    ).subscribe(({activeMandat, activePhase}) => {
      if (activePhase) {
        this.memberStateService.updateSearchParams({
          mandatIds: [activeMandat.id],
          phaseIds: [activePhase.id]
        });
      } else {
        this.memberStateService.updateSearchParams({
          mandatIds: [activeMandat.id]
        });
      }
      this.memberStateService.fetchMembers().subscribe();
    });
  }

  toggleExportModal() {
    this.isExportModalOpen = !this.isExportModalOpen;
  }

  toggleSendMessageModal() {
    if (this.isSmsSelectMode) {
      // En mode sélection SMS, on ignore le modal et on renvoie vers la page d'envoi immédiat.
      this.useSelectionForSms();
      return;
    }

    if (this.isSendMessageModalOpen) {
      this.isSendMessageModalOpen = false;
      return;
    }

    this.buildRecipientNumbers().then(numbers => {
      this.recipientNumbers = numbers;
      this.isSendMessageModalOpen = true;
    });
  }

  private async buildRecipientNumbers(): Promise<string[]> {
    return new Promise(resolve => {
      combineLatest([this.members$, this.memberStateService.selectedMemberIds$])
        .pipe(take(1))
        .subscribe(([members, selectedIds]) => {
          const safeMembers = members ?? [];
          const numbers = safeMembers
            .filter(member => selectedIds.includes(member.id) && !!member.contactInfo?.numberPhone)
            .map(member => this.normalizePhoneNumber(member.contactInfo.numberPhone))
            .filter((value, index, self) => self.indexOf(value) === index);
          resolve(numbers);
        });
    });
  }

  useSelectionForSms(): void {
    this.buildRecipientNumbers().then(numbers => {
      this.router.navigate(['/notifications/sms'], {
        state: {recipients: numbers}
      });
    });
  }

  private normalizePhoneNumber(raw: string): string {
    if (!raw) {
      return '';
    }
    // Nettoyage simple : suppression des espaces et du signe plus.
    return raw.replace(/\s+/g, '').replace(/\+/g, '');
  }

  toggleFilterPanel() {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  toggleDeleteModal() {
    this.isDeleteModalOpen = !this.isDeleteModalOpen;
  }

  onDeleteConfirmed() {
    this.toggleDeleteModal();
  }

  applyFilters(filters: any): void {
    this.memberStateService.updateSearchParams({...filters, page: 1});
    this.memberStateService.fetchMembers().subscribe();
  }

  resetFilters(): void {
    this.memberStateService.updateSearchParams({
      paymentStatus: '',
      registrationStatus: '',
      club: [],
      commission: [],
      bourse: [],
      mandatIds: [],
      phaseIds: []
    });
    this.memberStateService.fetchMembers().subscribe();
  }
}
