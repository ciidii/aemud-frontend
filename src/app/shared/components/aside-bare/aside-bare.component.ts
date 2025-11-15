import {Component, ElementRef, HostListener, inject} from '@angular/core';
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
export class AsideBareComponent {
  isPopoverOpen = false;
  protected sideBareService = inject(SidebarService);
  private authService = inject(AuthService);
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isPopoverOpen = false;
    }
  }

  togglePopover(event: Event): void {
    event.stopPropagation();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  toggleCollapse() {
    this.sideBareService.toggleCollapse();
  }

  logout(): void {
    this.authService.logout();
  }
}
