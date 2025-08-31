import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MemberModel} from "../../../core/models/member.model";

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

  private _allMember: MemberModel[] = [];
  private _filteredAndSortedMember: MemberModel[] = [];
  private _currentPage = new BehaviorSubject<number>(1);
  private _pageSize = new BehaviorSubject<number>(10);
  private _sortColumn = new BehaviorSubject<string>('date');
  private _sortDirection = new BehaviorSubject<SortDirection>('desc');
  private _filters = new BehaviorSubject<OrderFilter>({});
  private _paginationInfoSubject = new BehaviorSubject<PaginationInfo>({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  private _paginatedMemberSubject = new BehaviorSubject<MemberModel[]>([]);
  private _loading = new BehaviorSubject<boolean>(false);
}
