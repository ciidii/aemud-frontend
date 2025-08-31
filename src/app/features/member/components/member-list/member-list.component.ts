import {Component, inject} from '@angular/core';
import {MemberHttpService} from "../../services/member.http.service";
import {TableHeaderComponent} from "./table-header/table-header.component";
import {TableBodyComponent} from "./table-body/table-body.component";
import {TableFooterComponent} from "./table-footer/table-footer.component";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    TableHeaderComponent,
    TableBodyComponent,
    TableFooterComponent
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent {
  private membersService = inject(MemberHttpService);

  getAllMembers() {
    this.membersService.searchMember("", "", null, 1, 10).subscribe()
  }
}
