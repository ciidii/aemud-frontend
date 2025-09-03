import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgFor, NgIf} from "@angular/common";
import {MemberStateService} from "../../../services/member.state.service";
import {TableFiltersComponent} from "../table-filters/table-filters.component";
import {MemberModel} from "../../../../../core/models/member.model";
import {map, Observable} from "rxjs";
import {SkeletonLoaderComponent} from "../../../../../shared/components/skeleton-loader/skeleton-loader.component";

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [
    NgIf,
    TableFiltersComponent,
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

  skeletonRows = Array(10); // For repeating the skeleton loader
  memberStateService = inject(MemberStateService);
  selectedMemberIds$!: Observable<string[]>;
  isAllSelected$!: Observable<boolean>;

  ngOnInit(): void {
    this.selectedMemberIds$ = this.memberStateService.selectedMemberIds$;
    this.isAllSelected$ = this.memberStateService.selectedMemberIds$.pipe(
      map(selectedIds => {
        if (!this.members || this.members.length === 0) {
          return false;
        }
        return selectedIds.length === this.members.length;
      })
    );
  }

  get hasMembers(): boolean {
    return this.members !== null && this.members.length > 0;
  }

  navigateToMember(memberId: any) {
    console.log('Navigating to member with id:', memberId);
  }

  toggleSelectAll(): void {
    if (!this.members) return;
    const allMemberIds = this.members.map(m => m.id);
    this.memberStateService.toggleSelectAll(allMemberIds);
  }

  toggleMemberSelection(id: string): void {
    this.memberStateService.toggleMemberSelection(id);
  }
}

