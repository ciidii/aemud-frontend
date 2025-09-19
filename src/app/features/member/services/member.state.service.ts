import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, tap} from "rxjs";
import {MemberHttpService} from "./member.http.service";
import {MemberDataResponse} from "../../../core/models/member-data.model";

export type SortDirection = 'asc' | 'desc' | '';

export interface PaginationInfo {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type  MemberType = 'new' | 'old'
export type  MemberStatus = 'new' | 'old'


export interface OrderFilter {
  type?: MemberType | '';
  status?: MemberStatus | '';
  searchTerm?: string; // Pour une recherche globale
}

@Injectable({
  providedIn: 'root'
})
export class MemberStateService {
  private memberHttpService = inject(MemberHttpService);

  // --- State for data fetching and pagination ---
  private readonly _paginatedMemberSubject = new BehaviorSubject<MemberDataResponse[]>([]);
  private readonly _paginationInfoSubject = new BehaviorSubject<PaginationInfo>({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  private readonly _loading = new BehaviorSubject<boolean>(false);
  private readonly _sortColumn = new BehaviorSubject<string>('personalInfo.name');
  private readonly _sortDirection = new BehaviorSubject<SortDirection>('asc');

  readonly paginatedMembers$ = this._paginatedMemberSubject.asObservable();
  readonly paginationInfo$ = this._paginationInfoSubject.asObservable();
  readonly loading$ = this._loading.asObservable();
  readonly sortColumn$ = this._sortColumn.asObservable();
  readonly sortDirection$ = this._sortDirection.asObservable();

  // --- State for selection ---
  private readonly _selectedMemberIds = new BehaviorSubject<string[]>([]);
  readonly selectedMemberIds$ = this._selectedMemberIds.asObservable();
  readonly selectedMembersCount$ = this.selectedMemberIds$.pipe(map(ids => ids.length));
  readonly hasSelection$ = this.selectedMembersCount$.pipe(map(count => count > 0));


  // --- Methods for data fetching ---
  fetchMembers(keyword: string = "", criteria: string = "", filters: any = null, currentPage: number = 1, pageSize: number = 10, clear: boolean = false) {
    this._loading.next(true);
    if (clear) {
      this.clearSelection();
    }

    const sortColumn = this._sortColumn.getValue();
    const sortDirection = this._sortDirection.getValue();
    // Traduction de la direction du tri pour le backend
    const isAscending = sortDirection === 'asc';

    return this.memberHttpService.searchMember(keyword, criteria, filters, currentPage, pageSize, sortColumn, isAscending).pipe(
      tap(response => {
        this._paginatedMemberSubject.next(response.items);
        this._paginationInfoSubject.next({
          pageIndex: response.page,
          pageSize: pageSize,
          totalItems: response.records,
          totalPages: response.pages
        });
        this._loading.next(false);
      })
    );
  }

  updateSort(column: string) {
    const currentSortColumn = this._sortColumn.getValue();
    const currentSortDirection = this._sortDirection.getValue();

    if (column === currentSortColumn) {
      // If it's the same column, toggle direction
      this._sortDirection.next(currentSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If it's a new column, set it and default to 'asc'
      this._sortColumn.next(column);
      this._sortDirection.next('asc');
    }

    // Fetch data with new sort parameters
    this.fetchMembers().subscribe();
  }

  // --- Methods for selection ---
  toggleMemberSelection(id: string): void {
    const currentIds = this._selectedMemberIds.getValue();
    const index = currentIds.indexOf(id);

    if (index > -1) {
      this._selectedMemberIds.next(currentIds.filter(i => i !== id));
    } else {
      this._selectedMemberIds.next([...currentIds, id]);
    }
  }

  toggleSelectAll(pageMemberIds: string[], isPageSelected: boolean): void {
    const currentIds = new Set(this._selectedMemberIds.getValue());

    if (isPageSelected) {
      // Si la page est déjà toute sélectionnée, on retire ces membres de la sélection
      pageMemberIds.forEach(id => currentIds.delete(id));
    } else {
      // Sinon, on ajoute les membres de cette page à la sélection
      pageMemberIds.forEach(id => currentIds.add(id));
    }
    this._selectedMemberIds.next(Array.from(currentIds));
  }

  clearSelection(): void {
    this._selectedMemberIds.next([]);
  }
}
