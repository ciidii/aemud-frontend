import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgFor} from '@angular/common';

@Component({
    selector: 'app-member-home',
    templateUrl: './member-home.component.html',
    styleUrls: ['./member-home.component.css'],
    standalone: true,
    imports: [NgFor, RouterLinkActive, RouterLink, RouterOutlet]
})
export class MemberHomeComponent implements OnInit {
  asideNavContent!: any;

  ngOnInit(): void {
    this.asideNavContent = [
      {
        link: "/members/member/register-form",
        title: "Formulaire",
        disabled:""
      }, {
        link: "/members/member/list-members",
        title: "Liste des membres",
        disabled:""

      }, {
        link: "#",
        title: "Réinscription",
        disabled:"disabled"

      }, {
        link: "#",
        title: "Liste Réincription",
        disabled:"disabled"
      },
    ]
  }

}
