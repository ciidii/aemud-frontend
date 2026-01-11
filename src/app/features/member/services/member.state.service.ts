import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, tap} from "rxjs";
import {MemberHttpService} from "./member.http.service";
import {MemberDataResponse} from "../../../core/models/member-data.model";
import {SearchParams} from "../../../core/models/SearchParams";
import {AppStateService} from "../../../core/services/app-state.service";

export type SortDirection = 'asc' | 'desc' | '';

export interface PaginationInfo {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}


@Injectable({
  providedIn: 'root'
})
export class MemberStateService {

  private readonly _searchMemberParamsObject$ = new BehaviorSubject<SearchParams>({
    page: 1,
    rpp: 10,
    keyword: null,
    club: [],
    commission: [],
    paymentStatus: "",
    bourse: [],
    registrationStatus: null,
    mandatIds: [],
    phaseIds: [],
    registrationType: null,
    sortColumn: "personalInfo.name",
    sortDirection: true
  });
  private readonly _selectedMemberIds = new BehaviorSubject<string[]>([]);
  searchMemberParamsObject$ = this._searchMemberParamsObject$.asObservable();
  readonly selectedMemberIds$ = this._selectedMemberIds.asObservable();
  readonly selectedMembersCount$ = this.selectedMemberIds$.pipe(map(ids => ids.length));
  readonly hasSelection$ = this.selectedMembersCount$.pipe(map(count => count > 0));
  readonly sortDirection$ = this.searchMemberParamsObject$.pipe(map(params => params.sortDirection ? 'asc' : 'desc'));
  readonly sortColumn$ = this.searchMemberParamsObject$.pipe(map(params => params.sortColumn));
  private memberHttpService = inject(MemberHttpService);
  private readonly _paginatedMemberSubject = new BehaviorSubject<MemberDataResponse[]>([]);
  readonly paginatedMembers$ = this._paginatedMemberSubject.asObservable();
  private readonly _paginationInfoSubject = new BehaviorSubject<PaginationInfo>({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  readonly paginationInfo$ = this._paginationInfoSubject.asObservable();
  private readonly _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();

  fetchMembers(clear = false) {
    this._loading.next(true);
    if (clear) {
      this.clearSelection();
    }
    return this.memberHttpService.searchMember(this._searchMemberParamsObject$.getValue())
      .pipe(
        tap(response => {
          this._paginatedMemberSubject.next(response.items);
          this._paginationInfoSubject.next({
            pageIndex: response.page,
            pageSize: this._searchMemberParamsObject$.getValue().rpp,
            totalItems: response.records,
            totalPages: response.pages
          });
          this._loading.next(false);
        })
      );
  }

  updateSort(column: string) {
    const currentParams = this._searchMemberParamsObject$.getValue();
    const currentSortColumn = currentParams.sortColumn;
    const currentSortDirection = currentParams.sortDirection;

    let newDirectionBool: boolean;

    if (column === currentSortColumn) {
      newDirectionBool = !currentSortDirection;
    } else {
      newDirectionBool = true;
    }

    this.updateSearchParams({
      sortColumn: column,
      sortDirection: newDirectionBool
    });

    this.fetchMembers().subscribe();
  }

  toggleMemberSelection(id: string
  ):
    void {
    const currentIds = this._selectedMemberIds.getValue();
    const index = currentIds.indexOf(id);

    if (index > -1
    ) {
      this._selectedMemberIds.next(currentIds.filter(i => i !== id));
    } else {
      this._selectedMemberIds.next([...currentIds, id]);
    }
  }

  toggleSelectAll(pageMemberIds: string[], isPageSelected: boolean):
    void {
    const currentIds = new Set(this._selectedMemberIds.getValue());

    if (isPageSelected) {
      pageMemberIds.forEach(id => currentIds.delete(id));
    } else {
      pageMemberIds.forEach(id => currentIds.add(id));
    }
    this._selectedMemberIds.next(Array.from(currentIds));
  }

  clearSelection()
    :
    void {
    this._selectedMemberIds.next([]);
  }

  updateSearchParams(partial: Partial<SearchParams>) {
    const current = this._searchMemberParamsObject$.getValue();
    this._searchMemberParamsObject$.next({...current, ...partial});
  }

}
