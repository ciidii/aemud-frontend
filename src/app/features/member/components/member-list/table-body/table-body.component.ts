import {Component, EventEmitter, HostListener, inject, Input, OnInit, Output} from '@angular/core';
import {AsyncPipe, CommonModule, NgClass, NgFor, NgIf} from "@angular/common";
import {MemberStateService, SortDirection} from "../../../services/member.state.service";
import {map, Observable, take} from "rxjs";
import {SkeletonLoaderComponent} from "../../../../../shared/components/skeleton-loader/skeleton-loader.component";
import {Router} from "@angular/router";
import {MemberDataResponse} from "../../../../../core/models/member-data.model";

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    AsyncPipe,
    NgClass,
    SkeletonLoaderComponent
  ],
  templateUrl: './table-body.component.html',
  styleUrl: './table-body.component.scss'
})
export class TableBodyComponent implements OnInit {
  @Input() members: MemberDataResponse[] | null = [];
  @Input() loading: boolean | null = false;
  @Output() singleDelete = new EventEmitter<MemberDataResponse>();
  @Output() singleSms = new EventEmitter<MemberDataResponse>();

  skeletonRows = Array(8);
  activeDropdownMemberId: string | null = null;

  memberStateService = inject(MemberStateService);
  private router = inject(Router);

  selectedMemberIds$!: Observable<string[]>;
  isAllSelected$!: Observable<boolean>;
  sortColumn$!: Observable<string>;
  sortDirection$!: Observable<SortDirection>;

  get hasMembers(): boolean {
    return this.members !== null && this.members.length > 0;
  }

  ngOnInit(): void {
    this.selectedMemberIds$ = this.memberStateService.selectedMemberIds$;
    this.sortColumn$ = this.memberStateService.sortColumn$;
    this.sortDirection$ = this.memberStateService.sortDirection$;

    this.isAllSelected$ = this.memberStateService.selectedMemberIds$.pipe(
      map(selectedIds => {
        if (!this.members || this.members.length === 0) {
          return false;
        }
        const currentPageMemberIds = this.members.map(m => m.id);
        return currentPageMemberIds.every(id => selectedIds.includes(id));
      })
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.activeDropdownMemberId = null;
  }

  toggleDropdown(memberId: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdownMemberId = this.activeDropdownMemberId === memberId ? null : memberId;
  }

  navigateToMember(memberId: string): void {
    this.router.navigate(['/members/details', memberId]);
  }

  onAddMember(): void {
    this.router.navigateByUrl('/members/register-form');
  }

  onEditMember(memberId: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdownMemberId = null;
    this.router.navigate(['/members/details', memberId]);
  }

  onSendSms(member: MemberDataResponse, event: Event): void {
    event.stopPropagation();
    this.activeDropdownMemberId = null;
    if (member.contactInfo?.numberPhone) {
      const cleanPhone = member.contactInfo.numberPhone.replace(/\s+/g, '').replace(/\+/g, '');
      this.router.navigate(['/notifications/sms'], {
        state: { recipients: [cleanPhone] }
      });
    }
  }

  onDelete(member: MemberDataResponse, event: Event): void {
    event.stopPropagation();
    this.activeDropdownMemberId = null;
    this.singleDelete.emit(member);
  }

  toggleSelectAll(): void {
    if (!this.members) return;
    const allMemberIdsOnPage = this.members.map(m => m.id);
    this.isAllSelected$.pipe(take(1)).subscribe(isAllSelectedOnPage => {
      this.memberStateService.toggleSelectAll(allMemberIdsOnPage, isAllSelectedOnPage);
    });
  }

  toggleMemberSelection(id: string, event: Event): void {
    event.stopPropagation();
    this.memberStateService.toggleMemberSelection(id);
  }

  onSort(column: string): void {
    this.memberStateService.updateSort(column);
  }

  getInitials(firstname?: string, name?: string): string {
    const f = (firstname || '').trim().charAt(0).toUpperCase();
    const n = (name || '').trim().charAt(0).toUpperCase();
    return (f + n) || 'M';
  }

  getAvatarColor(name?: string): { bg: string, color: string } {
    const colors = [
      { bg: '#e0f2fe', color: '#0369a1' }, // Sky
      { bg: '#f0fdf4', color: '#15803d' }, // Green
      { bg: '#fdf4ff', color: '#a21caf' }, // Fuchsia
      { bg: '#fef3c7', color: '#b45309' }, // Amber
      { bg: '#f0fdfa', color: '#0f766e' }, // Teal
      { bg: '#ede9fe', color: '#6d28d9' }, // Purple
      { bg: '#fee2e2', color: '#b91c1c' }, // Red
      { bg: '#ffedd5', color: '#c2410c' }  // Orange
    ];
    const charCode = (name || 'A').charCodeAt(0);
    return colors[charCode % colors.length];
  }

  getStatusBadge(member: MemberDataResponse): { label: string, cssClass: string, icon: string } {
    if (member.status === 'ALUMNI' || (!member.isStudent && member.academicInfo?.studiesDomain === 'Alumni')) {
      return { label: 'Alumni / Diplômé', cssClass: 'badge-alumni', icon: 'bi-briefcase-fill' };
    }
    if (member.status === 'INACTIVE') {
      return { label: 'Inactif', cssClass: 'badge-inactive', icon: 'bi-pause-circle-fill' };
    }
    return { label: 'Étudiant Actif', cssClass: 'badge-active', icon: 'bi-mortarboard-fill' };
  }

  getWhatsAppUrl(phone?: string): string {
    if (!phone) return '#';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length === 9 && !clean.startsWith('221')) {
      clean = '221' + clean;
    }
    return `https://wa.me/${clean}`;
  }
}
