import {Component, OnInit} from '@angular/core';
import {LayoutComponent} from "../../../shared/components/layout/layout.component";

@Component({
    selector: 'app-member-shell',
    templateUrl: './member-home.component.html',
    styleUrls: ['./member-home.component.css'],
    standalone: true,
  imports: [LayoutComponent]
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
