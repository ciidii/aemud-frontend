import {Component, inject, OnInit} from '@angular/core';
import {TableHeaderComponent} from "./table-header/table-header.component";
import {TableBodyComponent} from "./table-body/table-body.component";
import {TableFooterComponent} from "./table-footer/table-footer.component";
import {MemberStateService} from "../../services/member.state.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {ExportModalComponent} from './export-modal/export-modal.component';
import {SendMessageModalComponent} from "./send-message-modal/send-message-modal.component";
import {TableFiltersComponent} from "./table-filters/table-filters.component";
import {FilterPanelComponent} from "./filter-panel/filter-panel.component";
import {
  ConfirmDeleteModalComponent
} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {MemberDataResponse} from "../../../../core/models/member-data.model";

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
  private memberStateService = inject(MemberStateService);

  members$: Observable<MemberDataResponse[]>;
  loading$: Observable<boolean>;
  selectedMembersCount$: Observable<number>;
  isExportModalOpen = false;
  isSendMessageModalOpen = false;
  isFilterPanelOpen = false;
  isDeleteModalOpen = false;

  constructor() {
    this.members$ = this.memberStateService.paginatedMembers$;
    this.loading$ = this.memberStateService.loading$;
    this.selectedMembersCount$ = this.memberStateService.selectedMembersCount$;
  }

  ngOnInit(): void {
    this.memberStateService.fetchMembers().subscribe();
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
}
