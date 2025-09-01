import {Component, inject, OnInit} from '@angular/core';
import {TableHeaderComponent} from "./table-header/table-header.component";
import {TableBodyComponent} from "./table-body/table-body.component";
import {TableFooterComponent} from "./table-footer/table-footer.component";
import {MemberStateService} from "../../services/member.state.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {MemberModel} from "../../../../core/models/member.model";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    TableHeaderComponent,
    TableBodyComponent,
    TableFooterComponent,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {
  private memberStateService = inject(MemberStateService);

  members$: Observable<MemberModel[]>;
  loading$: Observable<boolean>;

  constructor() {
    this.members$ = this.memberStateService.paginatedMembers$;
    this.loading$ = this.memberStateService.loading$;
  }

  ngOnInit(): void {
    this.memberStateService.fetchMembers().subscribe();
  }
}

