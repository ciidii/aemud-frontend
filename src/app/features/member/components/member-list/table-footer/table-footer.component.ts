import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {AsyncPipe, CommonModule, NgFor, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MemberStateService, PaginationInfo} from "../../../services/member.state.service";
import {Observable} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-table-footer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    AsyncPipe
  ],
  templateUrl: './table-footer.component.html',
  styleUrls: ['./table-footer.component.scss']
})
export class TableFooterComponent {
  @Output() exportTriggered = new EventEmitter<void>();
  @Output() sendMessageTriggered = new EventEmitter<void>();
  @Output() deleteTriggered = new EventEmitter<void>();
  @Output() useSelectionForSms = new EventEmitter<void>();
  @Input() isSmsSelectMode = false;

  private memberStateService = inject(MemberStateService);

  hasSelection$: Observable<boolean> = this.memberStateService.hasSelection$;
  selectedMembersCount$: Observable<number> = this.memberStateService.selectedMembersCount$;
  paginationInfo$: Observable<PaginationInfo> = this.memberStateService.paginationInfo$;

  pageSizes = [10, 25, 50, 100];

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = parseInt(target.value, 10);
    if (!isNaN(newSize)) {
      this.memberStateService.setPageSize(newSize);
    }
  }

  goToPage(page: number): void {
    this.memberStateService.goToPage(page);
  }

  nextPage(): void {
    this.paginationInfo$.pipe(take(1)).subscribe(info => {
      if (info.pageIndex < info.totalPages) {
        this.memberStateService.goToPage(info.pageIndex + 1);
      }
    });
  }

  previousPage(): void {
    this.paginationInfo$.pipe(take(1)).subscribe(info => {
      if (info.pageIndex > 1) {
        this.memberStateService.goToPage(info.pageIndex - 1);
      }
    });
  }

  clearSelection(): void {
    this.memberStateService.clearSelection();
  }

  getDisplayRange(info: PaginationInfo): { from: number, to: number } {
    const from = (info.pageIndex - 1) * info.pageSize + 1;
    const to = Math.min(info.pageIndex * info.pageSize, info.totalItems);
    return { from: info.totalItems > 0 ? from : 0, to };
  }
}
