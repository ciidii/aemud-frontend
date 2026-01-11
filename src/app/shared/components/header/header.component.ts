import {Component, ElementRef, HostListener, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthHttpService} from "../../../features/auth/services/auth-http.service";
import {Observable} from "rxjs";
import {NotificationPopoverComponent} from "../notification-popover/notification-popover.component";
import {AppStateService} from "../../../core/services/app-state.service";
import {PeriodeMandatDto} from "../../../features/configuration/periode-mandat/models/periode-mandat.model";
import {
  PeriodeMandatHttpService
} from "../../../features/configuration/periode-mandat/services/periode-mandat-http.service";
@Component({
  selector: 'app-nav-bar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLink, NgFor, AsyncPipe, NotificationPopoverComponent, NgIf, NgClass]
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

  private toDate(dateArray: [number, number, number]): Date {
    if (!dateArray) return new Date(NaN);
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day);
  }

  getPeriodeStatus(mandat: PeriodeMandatDto): 'PASSED' | 'CURRENT' | 'FUTURE' {
    if (mandat.estActif) {
      return 'CURRENT';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = this.toDate(mandat.dateFin);

    if (endDate < today) {
      return 'PASSED';
    }
    return 'FUTURE';
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
