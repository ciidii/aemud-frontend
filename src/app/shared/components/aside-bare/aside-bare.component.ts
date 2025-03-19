import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from "@angular/common";
import {NavigationService} from "../../services/navigation.service";

@Component({
  selector: 'app-aside-bare',
  templateUrl: './aside-bare.component.html',
  styleUrls: ['./aside-bare.component.css'],
  imports: [
    RouterLinkActive,
    RouterLink,
    NgIf
  ],
  standalone: true
})
export class AsideBareComponent {
  isCollapsed = false;
  openCategories: { [key: string]: boolean } = {};

  constructor(public navigationService: NavigationService) {
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleCategory(category: string) {
    this.openCategories[category] = !this.openCategories[category];
  }

  isCategoryOpen(category: string): boolean {
    return this.openCategories[category];
  }

  protected readonly NavigationService = NavigationService;
}
