import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserResponseDto, UserService} from '../../services/user.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {SessionService} from "../../../../core/services/session.service";
import {UserModel} from "../../../../core/models/user.model";
import {
  ConfirmDeleteModalComponent
} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {UAParser} from 'ua-parser-js';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ConfirmDeleteModalComponent],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  providers: [DatePipe]
})
export class UserDetailsComponent implements OnInit {

  user: UserResponseDto | null = null;
  loading = false;
  error: string | null = null;

  // Modals
  showPasswordModal = false;
  showDeleteModal = false;

  passwordForm!: FormGroup;
  passwordLoading = false;
  currentUser: UserModel | null = null;
  isSuperAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private datePipe: DatePipe,
  ) {

    this.initPasswordForm();
    this.currentUser = this.sessionService.getCurrentUser();
    this.isSuperAdmin = this.sessionService.isSuperAdmin();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    } else {
      this.error = 'Identifiant utilisateur manquant.';
    }
  }

  loadUser(id: string): void {
    this.loading = true;
    this.error = null;
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.user = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Impossible de charger les détails de l\'utilisateur.';
        this.loading = false;
      }
    });
  }

  // --- Actions ---

  toggleLock(): void {
    if (!this.user) return;

    const action$ = this.user.locked ?
      this.userService.unlockUser(this.user.id) :
      this.userService.lockUser(this.user.id);

    action$.subscribe({
      next: () => {
        this.notificationService.showSuccess(this.user!.locked ? 'Utilisateur déverrouillé.' : 'Utilisateur verrouillé.');
        this.loadUser(this.user!.id); // Reload to get fresh state
      },
      error: () => {
        this.notificationService.showError('Erreur lors de la mise à jour du statut.');
      }
    });
  }

  canLockOrUnlockOrChangePassword(): boolean {
    if (!this.currentUser || !this.user) {
      return false;
    }
    if (this.user.id === this.currentUser.id) {
      return false; // Can't lock yourself
    }

    const targetIsSuperAdmin = this.user.roles.includes('SUPER_ADMIN');
    if (targetIsSuperAdmin) {
      return false; // No one can lock a SUPER_ADMIN
    }

    const currentUserIsSuperAdmin = this.sessionService.isSuperAdmin();
    if (currentUserIsSuperAdmin) {
      return true; // SUPER_ADMIN can lock anyone (except other SUPER_ADMINs, handled above)
    }

    const targetIsAdmin = this.user.roles.includes('ADMIN');
    const currentUserIsAdminOnly = this.sessionService.isAdmin() && !this.sessionService.isSuperAdmin();
    if (targetIsAdmin && currentUserIsAdminOnly) {
      return false; // ADMIN can't lock another ADMIN
    }

    return true;
  }

  // --- Password Modal ---

  initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {mismatch: true};
  }

  openPasswordModal(): void {
    this.showPasswordModal = true;
    this.passwordForm.reset();
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  submitPasswordChange(): void {
    if (this.passwordForm.invalid || !this.user) return;

    this.passwordLoading = true;
    const changedPassword = {
      password: this.passwordForm.get('password')?.value,
      confirmPassword: this.passwordForm.get('confirmPassword')?.value,
      oldPassword: this.passwordForm.get('oldPassword')?.value
    };

    this.userService.changePassword(this.user.id, changedPassword).subscribe({
      next: () => {
        this.passwordLoading = false;
        this.closePasswordModal();
        this.notificationService.showSuccess('Mot de passe mis à jour avec succès.');
      },
      error: (err) => {
        this.passwordLoading = false;
        console.error(err);
        this.notificationService.showError('Erreur lors du changement de mot de passe.');
      }
    });
  }

  // --- Delete Modal ---

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.user) return;

    this.userService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Utilisateur supprimé avec succès.');
        this.closeDeleteModal();
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Erreur lors de la suppression de l\'utilisateur.');
        this.closeDeleteModal();
      }
    });
  }


  // --- UI Helpers ---

  // Helper to format loginTime array from backend
  formatLoginTime(loginTimeArray: number[] | undefined): string {
    if (!loginTimeArray || loginTimeArray.length < 5) {
      return '--';
    }
    // loginTime: [year, month, day, hour, minute, second, nanosecond]
    // Month is 1-indexed in the array, Date object expects 0-indexed month
    const year = loginTimeArray[0];
    const month = loginTimeArray[1] - 1; // Adjust month to be 0-indexed
    const day = loginTimeArray[2];
    const hour = loginTimeArray[3];
    const minute = loginTimeArray[4];
    const second = loginTimeArray[5] || 0;

    const date = new Date(year, month, day, hour, minute, second);
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss') || '--';
  }

  // Helper to simplify User Agent string
  simplifyUserAgent(uaString: string | undefined): string {
    if (!uaString) {
      return '--';
    }

    const parser = new UAParser(uaString);
    const result = parser.getResult();

    let browserInfo = 'Unknown Browser';
    if (result.browser.name) {
      browserInfo = `${result.browser.name}`;
      if (result.browser.version) {
        browserInfo += ` ${result.browser.version}`;
      }
    }

    let osInfo = 'Unknown OS';
    if (result.os.name) {
      osInfo = `${result.os.name}`;
      if (result.os.version) {
        osInfo += ` ${result.os.version}`;
      }
    }

    // Combine browser and OS info, or just show OS if browser is generic
    if (browserInfo === 'Unknown Browser' && osInfo === 'Unknown OS') {
      return uaString; // Fallback to original if nothing parsed
    } else if (browserInfo === 'Unknown Browser') {
      return osInfo;
    } else if (osInfo === 'Unknown OS') {
      return browserInfo;
    }
    return `${browserInfo} on ${osInfo}`;
  }


  getRoleLabel(role: string): string {
    const roles: { [key: string]: string } = {
      'USER': 'Utilisateur',
      'ADMIN': 'Administrateur',
      'SUPER_ADMIN': 'Super Admin',
      'GUEST': 'Invité'
    };
    return roles[role] || role;
  }

  getRoleDescription(role: string): string {
    const descs: { [key: string]: string } = {
      'USER': 'Accès standard',
      'ADMIN': 'Gestion complète',
      'SUPER_ADMIN': 'Accès total',
      'GUEST': 'Lecture seule'
    };
    return descs[role] || '';
  }

  getRoleIcon(role: string): string {
    const icons: { [key: string]: string } = {
      'USER': 'bi-person',
      'ADMIN': 'bi-shield-lock',
      'SUPER_ADMIN': 'bi-shield-fill',
      'GUEST': 'bi-eye'
    };
    return icons[role] || 'bi-circle';
  }

  redirectToMemberDetail(memberId: string) {
    this.router.navigateByUrl(`members/details/${memberId}`)
  }
}
