import {Component, EventEmitter, inject, Output} from '@angular/core';
import {Router} from "@angular/router";
import {MemberStateService} from "../../../services/member.state.service";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {Observable} from "rxjs";

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss'
})
export class TableHeaderComponent {
  @Output() exportTriggered = new EventEmitter<void>();

  private router = inject(Router);
  private memberStateService = inject(MemberStateService);

  totalItems$: Observable<number> = this.memberStateService.totalItems$;
  activeStatusTab$: Observable<string | null> = this.memberStateService.activeStatusTab$;

  statusTabs = [
    { label: 'Tous les membres', value: null, icon: 'bi-people' },
    { label: 'Étudiants Actifs', value: 'ACTIVE', icon: 'bi-mortarboard' },
    { label: 'Alumni / Diplômés', value: 'ALUMNI', icon: 'bi-briefcase' },
    { label: 'Inactifs', value: 'INACTIVE', icon: 'bi-person-x' }
  ];

  onSelectStatusTab(status: string | null): void {
    this.memberStateService.setStatusTab(status);
  }

  onAddMember(): void {
    this.router.navigateByUrl("/members/register-form");
  }
}
