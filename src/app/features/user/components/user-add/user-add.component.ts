import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreateUserRequest } from '../../services/user.service';
// Pour la recherche de membre :
import { MemberHttpService } from '../../../member/services/member.http.service';
import { ResponsePageableApi } from '../../../../core/models/response-pageable-api';
import { MemberDataResponse } from '../../../../core/models/member-data.model';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  form!: FormGroup;

  memberResults: MemberDataResponse[] = [];
  selectedMember: MemberDataResponse | null = null;

  roleDefinitions = [
    {
      value: 'USER',
      label: 'Utilisateur',
      description: 'Accès standard aux fonctionnalités de base.',
      icon: 'bi-person'
    },
    {
      value: 'ADMIN',
      label: 'Administrateur',
      description: 'Gestion des utilisateurs et configuration globale.',
      icon: 'bi-shield-lock'
    },
    {
      value: 'SUPER_ADMIN',
      label: 'Super Admin',
      description: 'Accès total au système.',
      icon: 'bi-shield-fill'
    },
    {
      value: 'GUEST',
      label: 'Invité',
      description: 'Accès limité en lecture seule.',
      icon: 'bi-eye'
    }
  ];

  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private memberHttpService: MemberHttpService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      memberId: [null, Validators.required],
      roles: [[], Validators.required],
      memberSearch: [''],
    });
  }

  onSearchMember(): void {
    const keyword = this.form.get('memberSearch')?.value;
    if (!keyword) {
      this.memberResults = [];
      return;
    }

    const searchParams: any = {
      page: 1,
      rpp: 10,
      keyword,
    };

    this.memberHttpService.searchMember(searchParams)
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
    } else {
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

    const payload: CreateUserRequest = {
      memberId: this.form.value.memberId,
      roles: this.form.value.roles,
    };

    this.loading = true;
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

  onCancel(): void {
    this.router.navigate(['/users']);
  }

}
