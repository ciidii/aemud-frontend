import {Component, OnInit} from '@angular/core';
import {MemberService} from "../../../core/services/member.service";
import {MemberCommunicationService} from "../../../core/services/member-communication.service";
import {AppStateService} from "../../../core/services/app-state-service";
import {RequestPageableVO} from "../../../core/models/requestPageableVO";
import {AddressService} from "../../../core/services/address.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-member',
  templateUrl: './list-member.component.html',
  styleUrls: ['./list-member.component.css']
})
export class ListMemberComponent implements OnInit {
  private readonly MAX_PAGES_DISPLAYED = 3;

  constructor(
    private memberService: MemberService,
    private memberCommunicationService: MemberCommunicationService,
    public appState: AppStateService,
    private router: Router
  ) {
  }

  displayAllMemberAgain() {
    if (!this.appState.memberState.keyword) {
      this.searchMember();
    }
  }

  ngOnInit(): void {
    this.searchMember();
    this.memberCommunicationService.deleteMember$.subscribe(
      value => {
        this.searchMember();
      }
    )
  }

  public searchMember() {
    this.appState.setMemberState({
      status: "LOADING"
    })
    let requestPegeableVO = new RequestPageableVO(1, 10);
    this.memberService.getAllMember(requestPegeableVO)
      .subscribe(
        {
          next: response => {
            this.appState.memberState.members = response.items
            this.appState.memberState.pageSize = requestPegeableVO.rpp;
            this.appState.memberState.totalPages = response.pages;
            console.log(this.appState.memberState.members)
            this.appState.setMemberState({
              status: "LOADED"
            })
          },
          error: err => {
            this.appState.setMemberState({
              status: "ERROR",
              errorMessage: err.errorMessage
            })
          }
        }
      );

  };

  displayMemberDetails(id: number) {
    this.router.navigateByUrl(`/members/member/member-details/${id}`)
  }

  nextPage(page: number) {
    this.appState.memberState.currentPage = page;
    this.searchMember();
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
