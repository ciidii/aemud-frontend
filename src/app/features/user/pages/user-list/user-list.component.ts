import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {UserResponseDto, UserSearchParams, UserService, UserStats} from "../../services/user.service";
import {NotificationService} from "../../../../core/services/notification.service";
import {SessionService} from "../../../../core/services/session.service";
import {UserModel} from "../../../../core/models/user.model";


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  filterForm!: FormGroup;

  users: UserResponseDto[] = [];
  loading = false;
  errorMessage: string | null = null;
  userStats: UserStats | null = null;

  // Pagination
  page = 1;
  rpp = 10;
  totalRecords = 0;
  totalPages = 1;

  roleOptions = [
    {value: 'USER', label: 'Utilisateur'},
    {value: 'ADMIN', label: 'Administrateur'},
    {value: 'SUPER_ADMIN', label: 'Super administrateur'},
    {value: 'GUEST', label: 'Invité'},
  ];

  statusOptions = [
    {value: 'all', label: 'Tous'},
    {value: 'true', label: 'Oui'},
    {value: 'false', label: 'Non'},
  ];

  currentUser: UserModel | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private sessionService: SessionService,
  ) {
    this.currentUser = this.sessionService.getCurrentUser();
  }

  canLockOrUnlock(user: UserResponseDto): boolean {
    if (!this.currentUser) {
      return false;
    }
    if (user.id === this.currentUser.id) {
      return false; // Can't lock yourself
    }

    const targetIsSuperAdmin = user.roles.includes('SUPER_ADMIN');
    if (targetIsSuperAdmin) {
      return false; // No one can lock a SUPER_ADMIN
    }

    const currentUserIsSuperAdmin = this.sessionService.isSuperAdmin();
    if (currentUserIsSuperAdmin) {
      return true; // SUPER_ADMIN can lock anyone (except other SUPER_ADMINs, handled above)
    }

    const targetIsAdmin = user.roles.includes('ADMIN');
    const currentUserIsAdminOnly = this.sessionService.isAdmin() && !this.sessionService.isSuperAdmin();
    if (targetIsAdmin && currentUserIsAdminOnly) {
      return false; // ADMIN can't lock another ADMIN
    }

    return true;
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      keyword: [''],
      roles: [[]],
      locked: ['all'],
      forcePasswordChange: ['all'],
    });

    this.loadUsers();
    this.loadStats();
  }

  loadStats(): void {
    this.userService.getUserStats().subscribe({
      next: (response) => {
        if (response.data) {
          this.userStats = response.data;
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement des statistiques: ", err);
        // On peut choisir de notifier l'utilisateur ou simplement de ne pas afficher les stats
      }
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = null;

    const params = this.buildSearchParams();

    this.userService.searchUsers(params).subscribe({
      next: (response) => {
        this.loading = false;
        this.users = response.items || [];
        this.totalRecords = response.records;
        this.page = response.page;
        this.totalPages = response.pages;
        this.loadStats(); // Refresh stats when users list changes
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs.';
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadUsers();
  }

  resetFilters(): void {
    this.filterForm.reset({
      keyword: '',
      roles: [],
      locked: 'all',
      forcePasswordChange: 'all',
    });
    this.page = 1;
    this.loadUsers();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.page = page;
    this.loadUsers();
  }

  goToUserDetails(user: UserResponseDto): void {
    this.router.navigate(['/users/details', user.id]);
  }

  toggleLock(user: UserResponseDto): void {
    const action$ = user.locked ?
      this.userService.unlockUser(user.id) :
      this.userService.lockUser(user.id);

    action$.subscribe({
      next: () => {
        this.notificationService.showSuccess(user.locked ? 'Utilisateur déverrouillé.' : 'Utilisateur verrouillé.');
        this.loadUsers();
      },
      error: () => {
        this.notificationService.showError('Erreur lors de la mise à jour du statut de verrouillage.');
      }
    });
  }

  toggleForcePasswordChange(user: UserResponseDto): void {
    const newValue = !user.forcePasswordChange;
    this.userService.forcePasswordChange(user.id, newValue).subscribe({
      next: () => {
        this.notificationService.showSuccess('Statut de changement de mot de passe mis à jour.');
        this.loadUsers();
      },
      error: () => {
        this.notificationService.showError('Erreur lors de la mise à jour du statut de changement de mot de passe.');
      }
    });
  }

  toggleRole(role: string) {
    const roles = this.filterForm.get('roles')?.value || [];

    if (roles.includes(role)) {
      this.filterForm.get('roles')?.setValue(roles.filter((r: string) => r !== role));
    } else {
      this.filterForm.get('roles')?.setValue([...roles, role]);
    }
  }

  isRoleSelected(role: string): boolean {
    const roles = this.filterForm.get('roles')?.value || [];
    return roles.includes(role);
  }

  private buildSearchParams(): UserSearchParams {
    const formValue = this.filterForm.value;

    const params: UserSearchParams = {
      page: this.page,
      rpp: this.rpp,
      keyword: formValue.keyword || undefined,
      roles: formValue.roles && formValue.roles.length ? formValue.roles : undefined,
    };

    if (formValue.locked !== 'all') {
      params.locked = formValue.locked === 'true';
    }

    if (formValue.forcePasswordChange !== 'all') {
      params.forcePasswordChange = formValue.forcePasswordChange === 'true';
    }

    return params;
  }

}
