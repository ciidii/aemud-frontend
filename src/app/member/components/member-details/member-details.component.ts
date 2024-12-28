import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MemberService} from "../../../core/services/member.service";
import {MemberData} from "../../../core/models/member/MemberData";
import {DatePipe, NgFor, NgIf} from '@angular/common';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, DatePipe]
})
export class MemberDetailsComponent implements OnInit {
  memberID!: number;
  member!: MemberData;

  constructor(private router: ActivatedRoute,
              private memberService: MemberService,
              private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.memberID = Number(this.router.snapshot.paramMap.get('member-id'));
    this.memberService.getMemberById(this.memberID).subscribe({
      next: response => {
        if (response.status == "OK") {
          this.member = response.data
          this.initTitle(this.member)
        }
      }, error: err => {
      }
    })
  }

  initTitle(member: MemberData | undefined) {
    if (member?.member) {
      this.titleService.setTitle(`${member.member.personalInfo.name} ${member.member.personalInfo.firstname}`)
    } else {
      this.titleService.setTitle("Not found")
    }
  }
}
