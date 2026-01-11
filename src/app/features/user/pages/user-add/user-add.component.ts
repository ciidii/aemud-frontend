import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin} from "rxjs";

import {CreateUserRequest, UserResponseDto, UserService} from '../../services/user.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {MemberHttpService} from '../../../member/services/member.http.service';
import {ResponsePageableApi} from '../../../../core/models/response-pageable-api';
import {MemberDataResponse} from '../../../../core/models/member-data.model';
import {SessionService} from "../../../../core/services/session.service";

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  form!: FormGroup;

  // State management
  isEditMode = false;
  pageTitle = 'Créer un utilisateur';
  pageSubtitle = 'Configurez l\'accès et les permissions pour un nouveau membre.';
  breadcrumbActive = 'Nouveau';
  submitButtonText = "Créer l'utilisateur";
  loadingText = 'Création...';

  memberResults: MemberDataResponse[] = [];
  selectedMember: MemberDataResponse | null = null;
  userId: string | null = null;
  initialUserRoles: string[] = [];
  initialForcePasswordChange = true;

  roleDefinitions: { value: string, label: string, description: string, icon: string }[] = [];
  canManageSuperAdmin = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private memberHttpService: MemberHttpService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.canManageSuperAdmin = this.sessionService.isSuperAdmin();
    this.initializeRoles();
    this.initForm();
    this.checkRoute();
  }

  private initializeRoles(): void {
    const allRoles = [
      { value: 'USER', label: 'Utilisateur', description: 'Accès standard aux fonctionnalités de base.', icon: 'bi-person' },
      { value: 'ADMIN', label: 'Administrateur', description: 'Gestion des utilisateurs et configuration globale.', icon: 'bi-shield-lock' },
      { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Accès total au système.', icon: 'bi-shield-fill' },
      { value: 'GUEST', label: 'Invité', description: 'Accès limité en lecture seule.', icon: 'bi-eye' }
    ];

    if (this.canManageSuperAdmin) {
      this.roleDefinitions = allRoles;
    } else {
      this.roleDefinitions = allRoles.filter(role => role.value !== 'SUPER_ADMIN');
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      memberId: [null, Validators.required],
      roles: [[], Validators.required],
      memberSearch: [''],
      forcePasswordChange: [true],
    });
  }

  private checkRoute(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.isEditMode = true;
      this.pageTitle = 'Modifier l\'utilisateur';
      this.pageSubtitle = 'Mettez à jour les rôles et les paramètres de l\'utilisateur.';
      this.breadcrumbActive = 'Modification';
      this.submitButtonText = 'Enregistrer les modifications';
      this.loadingText = 'Enregistrement...';
      this.loadUser(this.userId);
    }
  }

  private loadUser(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: resp => {
        // Store initial values to compare on submit
        this.initialUserRoles = resp.data.roles;
        this.initialForcePasswordChange = resp.data.forcePasswordChange;

        this.patchForm(resp.data);
        if (resp.data.memberId) {
          this.loadMemberInfo(resp.data.memberId);
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error('Erreur chargement user', err);
        this.notificationService.showError('Erreur lors du chargement des informations de l\'utilisateur.');
        this.router.navigate(['/users']);
      }
    });
  }

  private loadMemberInfo(memberId: string): void {
    this.memberHttpService.searchMember({ id: memberId, page: 1, rpp: 1 } as any)
      .subscribe((res: ResponsePageableApi<MemberDataResponse[]>) => {
        if (res.items && res.items.length > 0) {
          this.selectedMember = res.items[0];
          this.form.get('memberSearch')?.setValue(
            `${this.selectedMember.personalInfo.firstname} ${this.selectedMember.personalInfo.name}`,
            { emitEvent: false }
          );
        }
      });
  }

  private patchForm(user: UserResponseDto): void {
    this.form.patchValue({
      memberId: user.memberId,
      roles: user.roles,
      forcePasswordChange: user.forcePasswordChange,
    });
    if (this.isEditMode) {
      this.form.get('memberSearch')?.disable();
      this.form.get('memberId')?.clearValidators();
      this.form.get('memberId')?.updateValueAndValidity();
    }
  }

  onSearchMember(): void {
    if (this.isEditMode) return;
    const keyword = this.form.get('memberSearch')?.value;
    if (!keyword) {
      this.memberResults = [];
      return;
    }

    this.memberHttpService.searchMember({ page: 1, rpp: 10, keyword } as any)
      .subscribe((res: ResponsePageableApi<MemberDataResponse[]>) => {
        this.memberResults = res.items || [];
      });
  }

  selectMember(member: MemberDataResponse): void {
    this.selectedMember = member;
    this.form.patchValue({
      memberId: member.id,
      memberSearch: `${member.personalInfo.firstname} ${member.personalInfo.name} (${member.contactInfo.email})`,
    });
    this.memberResults = [];
  }

  toggleRoleCard(role: string): void {
    const currentRoles: string[] = this.form.get('roles')?.value || [];
    if (currentRoles.includes(role)) {
      this.form.get('roles')?.setValue(currentRoles.filter(r => r !== role));
    }
    else {
      this.form.get('roles')?.setValue([...currentRoles, role]);
    }
  }

  isRoleSelected(role: string): boolean {
    const currentRoles: string[] = this.form.get('roles')?.value || [];
    return currentRoles.includes(role);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.userId) {
      const observables = [];
      const newRoles = this.form.value.roles;
      const newForcePasswordChange = this.form.value.forcePasswordChange;

      // Only call API if roles have changed
      if (JSON.stringify(newRoles.sort()) !== JSON.stringify(this.initialUserRoles.sort())) {
        observables.push(this.userService.updateRoles(this.userId, newRoles));
      }

      // Only call API if forcePasswordChange has changed
      if (newForcePasswordChange !== this.initialForcePasswordChange) {
        observables.push(this.userService.forcePasswordChange(this.userId, newForcePasswordChange));
      }

      if (observables.length === 0) {
        this.loading = false;
        this.notificationService.showSuccess('Aucune modification détectée.');
        this.router.navigate(['/users', 'details', this.userId]);
        return;
      }

      forkJoin(observables).subscribe({
        next: () => {
          this.loading = false;
          this.notificationService.showSuccess('Utilisateur mis à jour avec succès.');
          this.router.navigate(['/users', 'details', this.userId]);
        },
        error: (err: any) => {
          this.loading = false;
          console.error(err);
          this.notificationService.showError("Erreur lors de la mise à jour de l'utilisateur.");
        }
      });
    } else {
      const payload: CreateUserRequest = {
        memberId: this.form.value.memberId,
        roles: this.form.value.roles,
        forcePasswordChange: this.form.value.forcePasswordChange,
      };

      this.userService.createUser(payload).subscribe({
        next: () => {
          this.loading = false;
          this.notificationService.showSuccess('Utilisateur créé avec succès.');
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          this.notificationService.showError("Erreur lors de la création de l'utilisateur.");
        }
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.userId) {
      this.router.navigate(['/users', 'details', this.userId]);
    } else {
      this.router.navigate(['/users']);
    }
  }

}

