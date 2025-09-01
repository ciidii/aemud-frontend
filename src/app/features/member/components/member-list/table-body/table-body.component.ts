import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgFor, NgIf} from "@angular/common";
import {MemberStateService} from "../../../services/member.state.service";
import {TableFiltersComponent} from "../table-filters/table-filters.component";
import {MemberModel} from "../../../../../core/models/member.model";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [
    NgIf,
    TableFiltersComponent,
    NgFor,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './table-body.component.html',
  styleUrl: './table-body.component.scss'
})
export class TableBodyComponent implements OnInit {
  @Input() members: MemberModel[] | null= [];

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

  get hasMembers(): boolean | null {
    return this.members && this.members.length > 0;
  }

  navigateToMember(memberId: any) {
    console.log('Navigating to member with id:', memberId);
  }

  toggleSelectAll(): void {
    // @ts-ignore
    const allMemberIds = this.members.map(m => m.id);
    this.memberStateService.toggleSelectAll(allMemberIds);
  }

  toggleMemberSelection(id: string): void {
    this.memberStateService.toggleMemberSelection(id);
  }
}
