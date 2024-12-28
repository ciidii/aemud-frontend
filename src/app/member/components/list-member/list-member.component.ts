import {Component, OnInit, ViewChild} from '@angular/core';
import {MemberService} from "../../../core/services/member.service";
import {AppStateService} from "../../../core/services/app-state-service";
import {Router} from "@angular/router";
import {NgClass, NgFor, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPopupComponent} from "../filter-popup/filter-popup.component";
import {YearOfSessionServiceService} from "../../../core/services/session/year-of-session-service.service";
import {YearOfSessionResponse} from "../../../core/models/session/YearOfSessionResponse";
import {ColumnPrinterComponent} from "../column-printer/column-printer.component";

@Component({
  selector: 'app-member',
  templateUrl: './list-member.component.html',
  styleUrls: ['./list-member.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, FilterPopupComponent, ReactiveFormsModule, ColumnPrinterComponent]
})
export class ListMemberComponent implements OnInit {
  private readonly MAX_PAGES_DISPLAYED = 3;
  yearOFSession: YearOfSessionResponse[] = [];

  @ViewChild(FilterPopupComponent) modal?: FilterPopupComponent;
  @ViewChild(ColumnPrinterComponent) columnPrinterModal?: ColumnPrinterComponent
  public searchCriteria = [
    {criteria: "firstname", displayedValue: "Prénom"},
    {criteria: "name", displayedValue: "Nom"}
  ]

  constructor(
    private memberService: MemberService,
    public appState: AppStateService,
    private yearOfSessionService: YearOfSessionServiceService,
    private router: Router,
    private fb: FormBuilder
  ) {
  }


  ngOnInit(): void {
    this.yearOfSessionService
      .getYears().subscribe(
      {
        next: resp => {
          if (resp.status == "OK") {
            this.yearOFSession = resp.data
          }
        },
        error: err => {
          console.log("une erreur c'est produite lors de récuppération de l'année")
        }
      }
    )

    this.yearOfSessionService.getCurrentYear().subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.appState.memberState.filters.year = resp.data.id;
          this.searchMemberByCriteria()
        } else {
          console.log("Une erreur s'est produite")
        }
      },
      error: err => {
        console.log("une erreur s'est produite")
      }
    });
    if (!this.appState.memberState.keyword) {
      this.searchMemberByCriteria();
    }
  }

  displayMemberDetails(id: number) {
    this.router.navigateByUrl(`/members/member/member-details/${id}`)
  }

  nextPage(page: number) {
    this.appState.memberState.currentPage = page;
    console.log(this.appState)
    this.searchMemberByCriteria()
  }

  searchMemberByCriteria() {
    this.memberService.searchMember(this.appState.memberState.keyword, this.appState.memberState.criteria, this.appState.memberState.filters).subscribe({
        next: data => {
          this.appState.memberState.members = data.items;
          this.appState.memberState.currentPage = data.page
          this.appState.memberState.totalPages = data.pages;
        },
        error: err => {
          console.log(err)
        }
      }
    );
  }

  open() {
    this.modal?.openModal();
  }

  openColumnPrinterModal() {
    if (this.columnPrinterModal) {
      this.columnPrinterModal.openPopupColumPrinter();
      console.log('Modal ouvert');
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
