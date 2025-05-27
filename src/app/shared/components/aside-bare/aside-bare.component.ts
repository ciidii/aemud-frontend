import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from "@angular/common";
import {NavigationService} from "../../services/navigation.service";

@Component({
  selector: 'app-aside-bare',
  templateUrl: './aside-bare.component.html',
  styleUrls: ['./aside-bare.component.scss'],
  imports: [RouterLinkActive, RouterLink, NgIf],
  standalone: true
})
export class AsideBareComponent {
  categories = {
    membres: true,
    gestionEntites: true,
    contributions: true,
    notifications: true,
    parametres: true
  };

  constructor(public navigationService: NavigationService) {
  }

  toggleCategory(category: keyof typeof this.categories, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    if (!event || (event.target as HTMLElement).closest('a')) {
      this.categories[category] = !this.categories[category];
    }
  }

  logout() {
    // Implémentation de la déconnexion
  }
}
