import {Component, EventEmitter, inject, Output} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {MemberStateService, PaginationInfo} from "../../../services/member.state.service";
import {Observable} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-table-footer',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './table-footer.component.html',
  styleUrls: ['./table-footer.component.scss']
})
export class TableFooterComponent {
  @Output() exportTriggered = new EventEmitter<void>();
  @Output() sendMessageTriggered = new EventEmitter<void>();
  @Output() deleteTriggered = new EventEmitter<void>();
  private memberStateService = inject(MemberStateService);

  hasSelection$: Observable<boolean> = this.memberStateService.hasSelection$;
  selectedMembersCount$: Observable<number> = this.memberStateService.selectedMembersCount$;
  paginationInfo$: Observable<PaginationInfo> = this.memberStateService.paginationInfo$;

  nextPage(): void {
    this.paginationInfo$.pipe(take(1)).subscribe(info => {
      if (info.pageIndex < info.totalPages) {
        this.memberStateService.fetchMembers("", "", null, info.pageIndex + 1, info.pageSize).subscribe();
      }
    });
  }

  previousPage(): void {
    this.paginationInfo$.pipe(take(1)).subscribe(info => {
      if (info.pageIndex > 1) {
        this.memberStateService.fetchMembers("", "", null, info.pageIndex - 1, info.pageSize).subscribe();
      }
    });
  }
}
