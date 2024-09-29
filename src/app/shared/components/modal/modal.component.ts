import {Component, ElementRef, ViewChild} from '@angular/core';
import {MemberModel} from "../../../member/model/member.model";
import {MemberService} from "../../../core/services/member.service";
import {MemberCommunicationService} from "../../../core/services/member-communication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @ViewChild("myModal", {static: false}) myModal?: ElementRef;
  memberDetails!: MemberModel;

  constructor(private memberService: MemberService,
              private memberCommunicationService: MemberCommunicationService,
              private router: Router
  ) {
  }


  openModal(member: MemberModel) {
    this.memberDetails = member;
    (this.myModal?.nativeElement as HTMLElement).style.display = 'block';
  }

  closeModal(memberDetails: MemberModel) {
    (this.myModal?.nativeElement as HTMLElement).style.display = 'none';
    this.memberCommunicationService.updateMemberUi(memberDetails);
  }

  handleDelete(memberDetails: MemberModel) {
    this.memberService.deleteMember(memberDetails).subscribe({
      next: value => {
        alert("Attention!\nL'opération est irreversible.");
        this.closeModal(memberDetails);
      }
    });
  }

  handleEdit(memberToEdit: MemberModel) {
    this.router.navigateByUrl(`welcome/edit-member/${memberToEdit.id}`)
  }
}
