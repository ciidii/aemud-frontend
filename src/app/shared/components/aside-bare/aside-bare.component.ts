import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { SidebarService } from "../../services/sidebar.service";

@Component({
  selector: 'app-aside-bare',
  templateUrl: './aside-bare.component.html',
  styleUrls: ['./aside-bare.component.scss'],
  imports: [RouterLinkActive, RouterLink, AsyncPipe],
  standalone: true
})
export class AsideBareComponent {
  protected sideBareService = inject(SidebarService);
  private authService = inject(AuthService);

  isOpen$ = this.sideBareService.isOpen$;

  toggleCollapse() {
    this.sideBareService.toggleCollapse();
  }

  logout(): void {
    this.authService.logout();
  }
}
