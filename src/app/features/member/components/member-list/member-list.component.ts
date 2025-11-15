import {Component, inject, OnInit} from '@angular/core';
import {TableHeaderComponent} from "./table-header/table-header.component";
import {TableBodyComponent} from "./table-body/table-body.component";
import {TableFooterComponent} from "./table-footer/table-footer.component";
import {MemberStateService} from "../../services/member.state.service";
import {filter, map, Observable, switchMap, take} from "rxjs";
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
import {PhaseHttpService} from "../../../mandat/services/phase-http.service";
import {PhaseStatus} from "../../../../core/models/phaseStatus.enum";

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
  isExportModalOpen = false;
  isSendMessageModalOpen = false;
  isFilterPanelOpen = false;
  isDeleteModalOpen = false;

  private memberStateService = inject(MemberStateService);
  private appStateService = inject(AppStateService);
  private phaseService = inject(PhaseHttpService);

  constructor() {
    this.members$ = this.memberStateService.paginatedMembers$;
    this.loading$ = this.memberStateService.loading$;
    this.selectedMembersCount$ = this.memberStateService.selectedMembersCount$;
  }

  ngOnInit(): void {
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
    this.isSendMessageModalOpen = !this.isSendMessageModalOpen;
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
