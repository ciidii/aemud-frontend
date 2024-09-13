import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {MemberModel} from "../../model/member.model";
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {MemberService} from "../../service/member.service";
import {MemberCommunicationService} from "../../service/member-communication.service";
import {AppStateService} from "../../service/app-state-service";
import {Router} from "@angular/router";
import {RequestPageableVO} from "../../../core/model/requestPageableVO";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  @ViewChild(ModalComponent, {static: false}) modal?: ModalComponent;
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

  openModal(member: MemberModel) {
    this.modal?.openModal(member);
  }

  public searchMember() {
    this.appState.setMemberState({
      status: "LOADING"
    })
   let  requestPegeableVO =new   RequestPageableVO(1,10);
    this.memberService.getAllMember(requestPegeableVO)
      .subscribe(
        response => {
            this.appState.memberState.members = response.items;
            this.appState.memberState.pageSize = requestPegeableVO.rpp;
            this.appState.memberState.totalPages = response.pages;
          this.appState.setMemberState({
            status: "LOADED"
          })
        },
        error => {
          this.appState.setMemberState({
            status: "ERROR",
            errorMessage: error.errorMessage
          })
        }
      );

  };

  nextPage(page: number) {
    this.appState.memberState.currentPage = page;
    this.searchMember();
  }


  getPages(): number[] {
    const totalPages = this.appState.memberState.totalPages;
    const currentPage = this.appState.memberState.currentPage;
    const maxPages = this.MAX_PAGES_DISPLAYED;

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
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

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}
