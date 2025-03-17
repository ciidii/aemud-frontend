import {Component, OnInit, signal} from '@angular/core';
import {ClubService} from "../../../core/services/club.service";
import {CommissionService} from "../../../core/services/commission.service";
import {YearOfSessionService} from "../../../core/services/year-of-session.service";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MemberService} from "../../core/member.service";
import {AppStateService} from "../../../core/services/app-state.service";


@Component({
  selector: 'app-filter-popup',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './filter-popup.component.html',
  styleUrl: './filter-popup.component.css'
})
export class FilterPopupComponent implements OnInit {
  openPopup = signal(false);
  clubs: any = [{}];
  years: any[] = [];

  commissions: any = [{}];
  formGroup!: FormGroup;

  constructor(
    private commissionService: CommissionService,
    private clubService: ClubService,
    private sessionService: YearOfSessionService,
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private appState: AppStateService
  ) {
  }

  ngOnInit(): void {
    this.clubService.getClubs().subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.clubs = resp.data;
        } else {
          console.error("Une erreur s'est produit")
        }
      },
      error: err => {
        console.error("Une erreur s'est produit")
      }
    });

    this.commissionService.getCommissions().subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.commissions = resp.data
        } else {
          console.error("Une erreur s'est produit")
        }
      },
      error: err => {
        console.error("Une erreur s'est produit")
      }
    });

    this.sessionService.getYears().subscribe({
      next: resp => {
        if (resp.status == "OK") {
          this.years = resp.data
        } else {
        }
      },
      error: err => {
        console.error("Une erreur s'est produit");
      }
    });

    this.formGroup = this.formBuilder.group({
      club: [''],
      year: [''],
      commission: ['']
    })
  }


  openModal() {
    this.openPopup.set(true)
  }

  closeModal() {
    this.openPopup.set(false)
  }

  applyFilters() {
    this.appState.memberState.filters = this.formGroup.value;
    this.memberService.searchMember(this.appState.memberState.keyword, this.appState.memberState.criteria, this.appState.memberState.filters).subscribe({
      next: resp => {
        this.appState.memberState.members = resp.items;
        this.appState.memberState.totalPages = resp.pages
        this.appState.memberState.currentPage = resp.page
        this.closeModal()
      },
      error: err => {
        console.log("Une erreur s'est produite");
      }
    })
  }

}
