import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../../core/header/header.component";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {LayoutComponent} from "../../../shared/components/layout/layout.component";

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LayoutComponent
  ],
  templateUrl: './notification-shell.component.html',
  styleUrl: './notification-shell.component.css'
})
export class NotificationShellComponent implements OnInit {
  asideNavContent!: any;

  ngOnInit(): void {
    this.asideNavContent = [
      {
        link: "/notification/sms",
        title: "SMS",
        disabled: ""
      }, {
        link: "/contribution/add-contribution",
        title: "Email",
        disabled: "disabled"
      },

    ]
  }
}
