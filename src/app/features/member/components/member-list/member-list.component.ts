import {Component, inject} from '@angular/core';
import {MemberService} from "../../services/member.service";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent {
  private membersService = inject(MemberService);

  getAllMembers() {
    this.membersService.searchMember("", "", null, 1, 10).subscribe()
  }
}
