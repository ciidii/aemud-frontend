import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

import {AuthService} from "../../services/auth.service";
import {SidebarService} from "../../services/sidebar.service";

@Component({
  selector: 'app-aside-bare',
  templateUrl: './aside-bare.component.html',
  styleUrls: ['./aside-bare.component.scss'],
  imports: [RouterLinkActive, RouterLink],
  standalone: true
})
export class AsideBareComponent{
  private authService = inject(AuthService);
  protected sideBareService = inject(SidebarService);

   toggleCollapse() {
    this.sideBareService.toggleCollapse();
  }

  logout(): void {
    this.authService.logout();
  }
}
