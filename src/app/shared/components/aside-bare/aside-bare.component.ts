import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {SidebarService} from "../../services/sidebar.service";
import {AuthHttpService} from "../../../features/auth/services/auth-http.service";
import {SessionService} from "../../../core/services/session.service";
import {Role} from "../../../core/models/user.model";

@Component({
  selector: 'app-aside-bare',
  templateUrl: './aside-bare.component.html',
  styleUrls: ['./aside-bare.component.scss'],
  imports: [RouterLinkActive, RouterLink, AsyncPipe, NgIf, NgClass],
  standalone: true
})
export class AsideBareComponent {
  protected sideBareService = inject(SidebarService);
  isOpen$ = this.sideBareService.isOpen$;
  isMobileOpen$ = this.sideBareService.isMobileOpen$;

  private authService = inject(AuthHttpService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  toggleCollapse(): void {
    this.sideBareService.toggleCollapse();
  }

  closeMobile(): void {
    this.sideBareService.closeMobile();
  }

  onNavItemClick(): void {
    this.sideBareService.closeOnNavigate();
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
}

