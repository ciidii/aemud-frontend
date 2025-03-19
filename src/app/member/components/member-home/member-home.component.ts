import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgFor} from '@angular/common';
import {AsideBareComponent} from "../../../shared/components/aside-bare/aside-bare.component";
import {LayoutComponent} from "../../../shared/components/layout/layout.component";

@Component({
    selector: 'app-member-shell',
    templateUrl: './member-home.component.html',
    styleUrls: ['./member-home.component.css'],
    standalone: true,
  imports: [NgFor, RouterLinkActive, RouterLink, RouterOutlet, AsideBareComponent, LayoutComponent]
})
export class MemberHomeComponent implements OnInit {
  asideNavContent!: any;

  ngOnInit(): void {
    this.asideNavContent = [
      {
        link: "/members/member/list-contribution",
        title: "Tableau de bord",
        disabled:""
      },
      {
        link: "/members/member/register-form",
        title: "Formulaire",
        disabled:""
      }, {
        link: "/members/member/list-members",
        title: "Liste des membres",
        disabled:""

      }, {
        link: "/members/member/member-registration",
        title: "Réinscription",
        disabled:""

      },
    ]
  }

}
