import {Component, ElementRef, HostListener, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthHttpService} from "../../../features/auth/services/auth-http.service";
import {Observable} from "rxjs";
import {NotificationPopoverComponent} from "../notification-popover/notification-popover.component";
import {AppStateService} from "../../../core/services/app-state.service";
import {PeriodeMandatDto} from "../../../features/periode-mandat/models/periode-mandat.model";
import {PeriodeMandatHttpService} from "../../../features/periode-mandat/services/periode-mandat-http.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLink, NgFor, AsyncPipe, NotificationPopoverComponent, NgIf]
})
export class HeaderComponent implements OnInit {
  isPopoverOpen = false;
  mandats$!: Observable<PeriodeMandatDto[]>;
  activeMandat$!: Observable<PeriodeMandatDto | null>;
  appStateService = inject(AppStateService);
  authService = inject(AuthHttpService);
  router = inject(Router);
  mandatHttpService = inject(PeriodeMandatHttpService);
  private elementRef = inject(ElementRef);

  ngOnInit(): void {
    this.mandats$ = this.appStateService.mandats$;
    this.activeMandat$ = this.appStateService.activeMandat$;

  }

  onMandatChange(mandat: PeriodeMandatDto): void {
    this.mandatHttpService.getPeriodeMandatById(mandat.id).subscribe(response => {
      if (response.data) {
        this.appStateService.setSelectedMandat(response.data);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  viewMyProfile(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.id) {
      this.router.navigate(['/users/details', currentUser.id]);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isPopoverOpen = false;
    }
  }
  //commente for test
}
