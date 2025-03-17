import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-config-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet, NgForOf]
})
export class ShellComponent {
  links = [
    {
      routeLink: "/configurations/config/shell", title: "Gérer les Bourses", routerLinkActive: "active"
    },
    {
      routeLink: "/configurations/config/commission-admin", title: "Gérer les commissions", routerLinkActive: "active"
    },
    {
      routeLink: "/configurations/config/club-admin", title: "Gérer les clubs", routerLinkActive: "active"
    },
    {
      routeLink: "/configurations/config/session-admin-page-admin",
      title: "Gérer les sessions",
      routerLinkActive: "active"
    }
  ]
}
