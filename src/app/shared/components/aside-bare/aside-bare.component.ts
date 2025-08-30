import {Component, HostBinding, inject, OnDestroy} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

import {AuthService} from "../../services/auth.service";

import {AsyncPipe, NgIf} from "@angular/common";
import {SidebarService} from "../../../core/services/sidebar.service";

@Component({
  selector: 'app-aside-bare',
  templateUrl: './aside-bare.component.html',
  styleUrls: ['./aside-bare.component.scss'],
  imports: [RouterLinkActive, RouterLink, NgIf, AsyncPipe,],
  standalone: true
})
export class AsideBareComponent{
  private authService = inject(AuthService);
  protected sideBareService = inject(SidebarService);
  private _isCollapsed = true;

   toggleCollapse() {
    this.sideBareService.toggleCollapse();
  }

  logout(): void {
    this.authService.logout();
  }
}
