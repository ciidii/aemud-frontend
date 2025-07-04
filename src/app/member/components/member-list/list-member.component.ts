import {Component, OnInit, ViewChild} from '@angular/core';
import {MemberService} from "../../core/member.service";
import {AppStateService} from "../../../core/services/app-state.service";
import {Router} from "@angular/router";
import {JsonPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPopupComponent} from "../filter-popup/filter-popup.component";
import {ColumnPrinterComponent} from "../popup-column-printer/column-printer.component";
import {YearOfSessionService} from "../../../core/services/year-of-session.service";
import {
  GroupForNotificationComponent
} from "../../../shared/popup-group-for-notification/group-for-notification.component";

@Component({
  selector: 'app-member',
  templateUrl: './list-member.component.html',
  styleUrls: ['./list-member.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, FilterPopupComponent, ReactiveFormsModule, ColumnPrinterComponent, GroupForNotificationComponent, JsonPipe]
})
export class ListMemberComponent implements OnInit {
  private readonly MAX_PAGES_DISPLAYED = 3;

  @ViewChild(FilterPopupComponent) modal?: FilterPopupComponent;
  @ViewChild(ColumnPrinterComponent) columnPrinterModal?: ColumnPrinterComponent
  @ViewChild(GroupForNotificationComponent) groupForNotificationModal?: GroupForNotificationComponent
  public searchCriteria = [
    {criteria: "firstname", displayedValue: "Prénom"},
    {criteria: "name", displayedValue: "Nom"},
    {criteria: "phone", displayedValue: "Numéro de téléphone"},
  ]

  constructor(
    private memberService: MemberService,
    public appState: AppStateService,
    private router: Router,
    private sessionService: YearOfSessionService
  ) {
  }


  ngOnInit(): void {

    this.sessionService.getCurrentYear().subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.appState.memberState.filters.year = resp.data.id
          this.searchMemberByCriteria();
        } else {
        }
      },
      error: err => {
        console.error("Une erreur s'est produit");
      }
    });
  }

  displayMemberDetails(id: number) {
    this.router.navigateByUrl(`members/member-details/${id}`)
  }

  nextPage(page: number) {
    this.appState.memberState.currentPage = page;
    this.searchMemberByCriteria()
  }

  searchMemberByCriteria() {
    this.memberService.searchMember(
      this.appState.memberState.keyword,
      this.appState.memberState.criteria,
      this.appState.memberState.filters
    ).subscribe({
        next: data => {
          this.appState.memberState.members = data.items;
          this.appState.memberState.currentPage = data.page;
          this.appState.memberState.totalPages = data.pages;
        },
        error: err => {
          console.log(err)
        }
      }
    );
  }

  openFilterPopup() {
    this.modal?.openModal();
  }

  openPopupForNotificationModal() {
    this.groupForNotificationModal?.openModal();
  }

  openColumnPrinterModal() {
    if (this.columnPrinterModal) {
      this.columnPrinterModal.openPopupColumPrinter();
    } else {
      console.error('ColumnPrinterComponent non initialisé');
    }
  }

  getPages(): number[] {
    const totalPages = this.appState.memberState.totalPages;
    const currentPage = this.appState.memberState.currentPage;
    const maxPages = this.MAX_PAGES_DISPLAYED;

    if (totalPages <= maxPages) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    let startPage: number;
    let endPage: number;

    if (currentPage <= Math.floor(maxPages / 2)) {
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + Math.floor(maxPages / 2) >= totalPages) {
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxPages / 2);
      endPage = currentPage + Math.floor(maxPages / 2);
    }

    return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
  }
}
