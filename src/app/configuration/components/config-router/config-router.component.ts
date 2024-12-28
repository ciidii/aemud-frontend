import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-config-home',
  templateUrl: './config-router.component.html',
  styleUrls: ['./config-router.component.css'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet, NgForOf]
})
export class ConfigRouterComponent {
  links = [
    {
      routeLink: "/configurations/config/home", title: "Gérer les Bourses", routerLinkActive: "active"
    },
    {
      routeLink: "/configurations/config/commission-admin", title: "Gérer les commissions", routerLinkActive: "active"
    },
    {
      routeLink: "/configurations/config/club-admin", title: "Gérer les clubs", routerLinkActive: "active"
    },
    {
      routeLink: "/configurations/config/session-admin", title: "Gérer les sessions", routerLinkActive: "active"
    }
  ]
}
