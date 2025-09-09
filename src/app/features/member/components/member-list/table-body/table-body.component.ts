import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgFor, NgIf} from "@angular/common";
import {MemberStateService, SortDirection} from "../../../services/member.state.service";
import {MemberModel} from "../../../../../core/models/member.model";
import {map, Observable, take} from "rxjs";
import {SkeletonLoaderComponent} from "../../../../../shared/components/skeleton-loader/skeleton-loader.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    NgClass,
    SkeletonLoaderComponent
  ],
  templateUrl: './table-body.component.html',
  styleUrl: './table-body.component.scss'
})
export class TableBodyComponent implements OnInit {
  @Input() members: MemberModel[] | null = [];
  @Input() loading: boolean | null = false;

  skeletonRows = Array(10);
  memberStateService = inject(MemberStateService);
  selectedMemberIds$!: Observable<string[]>;
  isAllSelected$!: Observable<boolean>;

  // Observables for sorting state
  sortColumn$!: Observable<string>;
  sortDirection$!: Observable<SortDirection>;

  private router = inject(Router);

  ngOnInit(): void {
    this.selectedMemberIds$ = this.memberStateService.selectedMemberIds$;
    this.sortColumn$ = this.memberStateService.sortColumn$;
    this.sortDirection$ = this.memberStateService.sortDirection$;

    this.isAllSelected$ = this.memberStateService.selectedMemberIds$.pipe(
      map(selectedIds => {
        if (!this.members || this.members.length === 0) {
          return false;
        }
        // Vérifie si chaque membre de la page actuelle est inclus dans la liste des sélectionnés
        const currentPageMemberIds = this.members.map(m => m.id);
        return currentPageMemberIds.every(id => selectedIds.includes(id));
      })
    );
  }

  get hasMembers(): boolean {
    return this.members !== null && this.members.length > 0;
  }

  navigateToMember(memberId: any) {
    this.router.navigate(['/members/details', memberId]);
  }

  toggleSelectAll(): void {
    if (!this.members) return;

    const allMemberIdsOnPage = this.members.map(m => m.id);

    // On récupère l'état actuel de la case à cocher pour décider de l'action
    this.isAllSelected$.pipe(take(1)).subscribe(isAllSelectedOnPage => {
      this.memberStateService.toggleSelectAll(allMemberIdsOnPage, isAllSelectedOnPage);
    });
  }

  toggleMemberSelection(id: string): void {
    this.memberStateService.toggleMemberSelection(id);
  }

  onSort(column: string): void {
    this.memberStateService.updateSort(column);
  }
}


