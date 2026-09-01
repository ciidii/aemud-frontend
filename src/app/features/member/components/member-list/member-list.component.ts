import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TableHeaderComponent} from "./table-header/table-header.component";
import {TableBodyComponent} from "./table-body/table-body.component";
import {TableFooterComponent} from "./table-footer/table-footer.component";
import {MemberStateService} from "../../services/member.state.service";
import {MemberHttpService} from "../../services/member.http.service";
import {catchError, combineLatest, filter, firstValueFrom, forkJoin, map, Observable, of, Subject, switchMap, take, takeUntil} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {ExportModalComponent} from './export-modal/export-modal.component';
import {TableFiltersComponent} from "./table-filters/table-filters.component";
import {FilterPanelComponent} from "./filter-panel/filter-panel.component";
import {
  ConfirmDeleteModalComponent
} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {MemberDataResponse} from "../../../../core/models/member-data.model";
import {AppStateService} from "../../../../core/services/app-state.service";
import {PhaseStatus} from "../../../../core/models/phaseStatus.enum";
import {ActivatedRoute, Router} from "@angular/router";
import {PhaseHttpService} from "../../../configuration/periode-mandat/services/phase-http.service";
import {SearchParams} from "../../../../core/models/SearchParams";
import {SendMessageModalComponent} from "./send-message-modal/send-message-modal.component";
import {ToastrService} from "ngx-toastr";

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
export class MemberListComponent implements OnInit, OnDestroy {
  members$: Observable<MemberDataResponse[]>;
  loading$: Observable<boolean>;
  selectedMembersCount$: Observable<number>;
  hasSelection$: Observable<boolean>;
  isExportModalOpen = false;
  isSendMessageModalOpen = false;
  isFilterPanelOpen = false;
  isDeleteModalOpen = false;
  memberToDelete: MemberDataResponse | null = null;
  recipientNumbers: string[] = [];
  isSmsSelectMode = false;
  searchParamsForExport$: Observable<Partial<SearchParams>>;

  private memberStateService = inject(MemberStateService);
  private memberHttpService = inject(MemberHttpService);
  private appStateService = inject(AppStateService);
  private phaseService = inject(PhaseHttpService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  constructor() {
    this.members$ = this.memberStateService.paginatedMembers$;
    this.loading$ = this.memberStateService.loading$;
    this.selectedMembersCount$ = this.memberStateService.selectedMembersCount$;
    this.hasSelection$ = this.memberStateService.hasSelection$;

    this.searchParamsForExport$ = combineLatest([
      this.memberStateService.selectedMemberIds$,
      this.memberStateService.searchMemberParamsObject$
    ]).pipe(
      map(([selectedIds, currentFilters]) => {
        if (selectedIds.length > 0) {
          return { memberIds: selectedIds };
        }
        return currentFilters;
      })
    );
  }

  ngOnInit(): void {
    // 1. Initialiser l'état depuis l'URL (Deep Linking / Bookmarking)
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      this.isSmsSelectMode = params.get('smsSelect') === 'true';
      if (this.isSmsSelectMode) {
        this.memberStateService.clearSelection();
      }

      const status = params.get('status');
      const keyword = params.get('keyword');
      const paymentStatus = params.get('paymentStatus');
      const pageStr = params.get('page');
      const page = pageStr ? parseInt(pageStr, 10) : 1;

      if (status || keyword || paymentStatus || pageStr) {
        this.memberStateService.updateSearchParams({
          status: status || null,
          keyword: keyword || null,
          paymentStatus: paymentStatus || '',
          page: !isNaN(page) && page > 0 ? page : 1
        });
      }
    });

    // 2. Synchroniser les changements de paramètres dans l'URL du navigateur
    this.memberStateService.searchMemberParamsObject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const queryParams: any = {};
      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.status) queryParams.status = params.status;
      if (params.paymentStatus) queryParams.paymentStatus = params.paymentStatus;
      if (params.page && params.page > 1) queryParams.page = params.page;
      if (this.isSmsSelectMode) queryParams.smsSelect = 'true';

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        replaceUrl: true
      });
    });

    // 3. Charger le mandat initial et déclencher la récupération des membres
    this.appStateService.loadInitialMandat().subscribe();
    this.memberStateService.fetchMembers().subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleExportModal(): void {
    this.isExportModalOpen = !this.isExportModalOpen;
  }

  toggleSendMessageModal(): void {
    if (this.isSmsSelectMode) {
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
    if (!raw) return '';
    return raw.replace(/\s+/g, '').replace(/\+/g, '');
  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  toggleDeleteModal(): void {
    this.memberToDelete = null;
    this.isDeleteModalOpen = !this.isDeleteModalOpen;
  }

  handleSingleDelete(member: MemberDataResponse): void {
    this.memberToDelete = member;
    this.isDeleteModalOpen = true;
  }

  async onDeleteConfirmed(): Promise<void> {
    if (this.memberToDelete) {
      this.memberHttpService.deleteMember(this.memberToDelete.id).subscribe({
        next: () => {
          this.toastr.success('Membre supprimé avec succès.');
          this.memberToDelete = null;
          this.isDeleteModalOpen = false;
          this.memberStateService.fetchMembers().subscribe();
        },
        error: () => {
          this.toastr.error('Impossible de supprimer ce membre.');
          this.memberToDelete = null;
          this.isDeleteModalOpen = false;
        }
      });
    } else {
      const selectedIds = await firstValueFrom(this.memberStateService.selectedMemberIds$);
      if (selectedIds && selectedIds.length > 0) {
        const deleteObservables = selectedIds.map(id => this.memberHttpService.deleteMember(id));
        forkJoin(deleteObservables).subscribe({
          next: () => {
            this.toastr.success(`${selectedIds.length} membre(s) supprimé(s) avec succès.`);
            this.memberStateService.clearSelection();
            this.isDeleteModalOpen = false;
            this.memberStateService.fetchMembers().subscribe();
          },
          error: () => {
            this.toastr.error('Une erreur est survenue lors de la suppression groupée.');
            this.isDeleteModalOpen = false;
            this.memberStateService.fetchMembers().subscribe();
          }
        });
      } else {
        this.toggleDeleteModal();
      }
    }
  }

  applyFilters(filters: any): void {
    this.memberStateService.updateSearchParams({...filters, page: 1});
    this.memberStateService.fetchMembers().subscribe();
  }

  resetFilters(): void {
    this.memberStateService.updateSearchParams({
      page: 1,
      keyword: null,
      status: null,
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
