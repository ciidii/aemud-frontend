import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {MemberService} from "../../../core/services/member.service";
import {MemberData} from "../../../core/models/member/MemberData";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  memberID!: number;
  member!: MemberData;

  constructor(private router: ActivatedRoute, private memberService: MemberService) {
  }

  ngOnInit(): void {
    this.memberID = Number(this.router.snapshot.paramMap.get('member-id'));
    this.memberService.getMemberById(this.memberID).subscribe({
      next: response => {
        if (response.status == "OK") {
          this.member = response.data
        }
      }, error: err => {
      }
    })
  }
}
