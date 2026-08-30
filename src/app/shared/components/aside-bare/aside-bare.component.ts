import {Component, ElementRef, HostListener, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AsyncPipe, NgClass, NgFor, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {SidebarService} from "../../services/sidebar.service";
import {AuthHttpService} from "../../../features/auth/services/auth-http.service";
import {SessionService} from "../../../core/services/session.service";
import {AppStateService} from "../../../core/services/app-state.service";
import {PeriodeMandatHttpService} from "../../../features/configuration/periode-mandat/services/periode-mandat-http.service";
import {PeriodeMandatDto} from "../../../features/configuration/periode-mandat/models/periode-mandat.model";
import {Role} from "../../../core/models/user.model";
import {NotificationPopoverComponent} from "../notification-popover/notification-popover.component";

@Component({
  selector: 'app-aside-bare',
  templateUrl: './aside-bare.component.html',
  styleUrls: ['./aside-bare.component.scss'],
  imports: [RouterLinkActive, RouterLink, AsyncPipe, NgIf, NgClass, NgFor, NotificationPopoverComponent],
  standalone: true
})
export class AsideBareComponent implements OnInit {
  protected sideBareService = inject(SidebarService);
  isOpen$ = this.sideBareService.isOpen$;
  isMobileOpen$ = this.sideBareService.isMobileOpen$;

  private authService = inject(AuthHttpService);
  private sessionService = inject(SessionService);
  private appStateService = inject(AppStateService);
  private mandatHttpService = inject(PeriodeMandatHttpService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  mandats$!: Observable<PeriodeMandatDto[]>;
  activeMandat$!: Observable<PeriodeMandatDto | null>;
  isMandatDropdownOpen = false;
  isNotificationPopoverOpen = false;

  ngOnInit(): void {
    this.mandats$ = this.appStateService.mandats$;
    this.activeMandat$ = this.appStateService.activeMandat$;
  }

  toggleCollapse(): void {
    this.sideBareService.toggleCollapse();
    this.isMandatDropdownOpen = false;
    this.isNotificationPopoverOpen = false;
  }

  closeMobile(): void {
    this.sideBareService.closeMobile();
    this.isMandatDropdownOpen = false;
    this.isNotificationPopoverOpen = false;
  }

  onNavItemClick(): void {
    this.sideBareService.closeOnNavigate();
    this.isMandatDropdownOpen = false;
    this.isNotificationPopoverOpen = false;
  }

  toggleMandatDropdown(event: Event): void {
    event.stopPropagation();
    this.isMandatDropdownOpen = !this.isMandatDropdownOpen;
    this.isNotificationPopoverOpen = false;
  }

  toggleNotificationPopover(event: Event): void {
    event.stopPropagation();
    this.isNotificationPopoverOpen = !this.isNotificationPopoverOpen;
    this.isMandatDropdownOpen = false;
  }

  onMandatChange(mandat: PeriodeMandatDto): void {
    this.mandatHttpService.getPeriodeMandatById(mandat.id).subscribe(response => {
      if (response.data) {
        this.appStateService.setSelectedMandat(response.data);
      }
    });
    this.isMandatDropdownOpen = false;
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

  get currentUser() {
    return this.sessionService.getCurrentUser();
  }

  get userInitials(): string {
    const user = this.currentUser;
    if (!user || !user.username) return 'AD';
    return user.username.substring(0, 2).toUpperCase();
  }

  get userName(): string {
    const user = this.currentUser;
    return user?.username || 'Administrateur';
  }

  get userRoleLabel(): string {
    const user = this.currentUser;
    if (!user || !user.roles || user.roles.length === 0) return 'Utilisateur';
    if (user.roles.includes(Role.SUPER_ADMIN)) return 'Super Admin';
    if (user.roles.includes(Role.ADMIN)) return 'Administrateur';
    return 'Membre';
  }

  logout(): void {
    this.sideBareService.closeMobile();
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => this.router.navigate(['/auth/login'])
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMandatDropdownOpen = false;
      this.isNotificationPopoverOpen = false;
    }
  }
}


