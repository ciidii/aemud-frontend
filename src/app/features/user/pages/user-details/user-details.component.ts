import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserResponseDto, UserService} from '../../services/user.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {SessionService} from "../../../../core/services/session.service";
import {UserModel} from "../../../../core/models/user.model";

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user: UserResponseDto | null = null;
  loading = false;
  error: string | null = null;

  // Password Modal
  showPasswordModal = false;
  passwordForm!: FormGroup;
  passwordLoading = false;
  currentUser: UserModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private sessionService: SessionService,
  ) {
    this.initPasswordForm();
    this.currentUser = this.sessionService.getCurrentUser();
  }

  canLockOrUnlock(): boolean {
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    } else {
      this.error = 'Identifiant utilisateur manquant.';
    }
  }

  initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {mismatch: true};
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
    const newPassword = this.passwordForm.get('password')?.value;

    this.userService.changePassword(this.user.id, newPassword).subscribe({
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
