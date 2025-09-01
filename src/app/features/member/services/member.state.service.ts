import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, tap} from "rxjs";
import {MemberModel} from "../../../core/models/member.model";
import {MemberHttpService} from "./member.http.service";

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
  private readonly _paginatedMemberSubject = new BehaviorSubject<MemberModel[]>([]);
  private readonly _paginationInfoSubject = new BehaviorSubject<PaginationInfo>({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  private readonly _loading = new BehaviorSubject<boolean>(false);

  readonly paginatedMembers$ = this._paginatedMemberSubject.asObservable();
  readonly paginationInfo$ = this._paginationInfoSubject.asObservable();
  readonly loading$ = this._loading.asObservable();

  // --- State for selection ---
  private readonly _selectedMemberIds = new BehaviorSubject<string[]>([]);
  readonly selectedMemberIds$ = this._selectedMemberIds.asObservable();
  readonly selectedMembersCount$ = this.selectedMemberIds$.pipe(map(ids => ids.length));
  readonly hasSelection$ = this.selectedMembersCount$.pipe(map(count => count > 0));


  // --- Methods for data fetching ---
  fetchMembers(keyword: string = "", criteria: string = "", filters: any = null, currentPage: number = 1, pageSize: number = 10) {
    this._loading.next(true);
    return this.memberHttpService.searchMember(keyword, criteria, filters, currentPage, pageSize).pipe(
      tap(response => {
        this._paginatedMemberSubject.next(response.items);
        this._paginationInfoSubject.next({
          pageIndex: response.page,
          pageSize: pageSize,
          totalItems: response.records,
          totalPages: response.pages
        });
        this._loading.next(false);
        this.clearSelection(); // Clear selection on new data fetch
      })
    );
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

  toggleSelectAll(memberIds: string[]): void {
    const currentSelection = this._selectedMemberIds.getValue();
    if (currentSelection.length === memberIds.length) {
      this._selectedMemberIds.next([]);
    } else {
      this._selectedMemberIds.next(memberIds);
    }
  }

  clearSelection(): void {
    this._selectedMemberIds.next([]);
  }
}
