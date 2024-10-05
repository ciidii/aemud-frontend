import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-member-home',
  templateUrl: './member-home.component.html',
  styleUrls: ['./member-home.component.css']
})
export class MemberHomeComponent implements OnInit {
  asideNavContent!: any;

  ngOnInit(): void {
    this.asideNavContent = [
      {
        link: "/members/member/register-form",
        title: "Formulaire"
      }, {
        link: "/members/member/list-members",
        title: "Liste des membres"
      }, {
        link: "formmmmm",
        title: "Réinscription"
      }, {
        link: "/members/member/register-formmmmm",
        title: "Liste Réincription"
      },
    ]
  }

}
