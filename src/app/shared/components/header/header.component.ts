import {Component, ElementRef, HostListener, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from "../../../features/auth/services/auth.service";
import {Observable} from "rxjs";
import {NotificationPopoverComponent} from "../notification-popover/notification-popover.component";
import {AppStateService} from "../../../core/services/app-state.service";
import {MandatDto} from "../../../core/models/mandat.model";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLink, NgFor, AsyncPipe, NotificationPopoverComponent, NgIf]
})
export class HeaderComponent implements OnInit {
  isPopoverOpen = false;
  mandats$!: Observable<MandatDto[]>;
  activeMandat$!: Observable<MandatDto | null>;
  appStateService = inject(AppStateService);
  authService = inject(AuthService);
  router = inject(Router);
  private elementRef = inject(ElementRef);

  ngOnInit(): void {
    this.mandats$ = this.appStateService.mandats$;
    this.activeMandat$ = this.appStateService.activeMandat$;

  }

  onMandatChange(mandat: MandatDto): void {
    this.appStateService.setSelectedMandat(mandat);

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isPopoverOpen = false;
    }
  }
}
