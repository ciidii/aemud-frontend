import {Component, HostListener, inject, OnInit} from '@angular/core';
import {AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MemberHttpService} from "../../services/member.http.service";
import {MemberModel} from "../../../../core/models/member.model";
import {map, Observable} from "rxjs";
import {ResponseEntityApi} from "../../../../core/models/response-entity-api";
import {InfoSectionComponent} from "../../../../shared/components/info-section/info-section.component";
import {ReregisterModalComponent} from "../../components/reregister-modal/reregister-modal.component";
import {ConfirmDeleteModalComponent} from "../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import {MemberStateService} from "../../services/member.state.service";
import {SendMessageModalComponent} from "../../components/member-list/send-message-modal/send-message-modal.component";
import {ExportModalComponent} from "../../components/member-list/export-modal/export-modal.component";
import {FormatKeyPipe} from "../../../../shared/pipes/format-key.pipe";
import {DatePipe} from "@angular/common";
import {ToDatePipe} from "../../../../shared/pipes/to-date.pipe";

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [AsyncPipe, NgIf, JsonPipe, InfoSectionComponent, ReregisterModalComponent, NgForOf, ConfirmDeleteModalComponent, SendMessageModalComponent, ExportModalComponent, FormatKeyPipe, DatePipe, ToDatePipe, NgSwitch, NgClass, NgSwitchCase, NgSwitchDefault],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberHttpService = inject(MemberHttpService);
  private memberStateService = inject(MemberStateService);

  member$!: Observable<MemberModel | undefined>;
  isReregisterModalOpen = false;
  isDeleteModalOpen = false;
  isSendMessageModalOpen = false;
  isExportModalOpen = false;
  isActionsDropdownOpen = false;
  subscriptionYears = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];
  selectedSubscriptionYear = new Date().getFullYear();
  private memberId: string | null = null;

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.member$ = this.memberHttpService.getMemberById(this.memberId).pipe(
        map((response: ResponseEntityApi<MemberModel>) => response.data)
      );
    }
  }

  // --- Modal Toggle Methods ---

  toggleDeleteModal(): void {
    this.isDeleteModalOpen = !this.isDeleteModalOpen;
  }

  toggleReregisterModal(): void {
    this.isReregisterModalOpen = !this.isReregisterModalOpen;
  }

  openSendMessageModal(): void {
    if (!this.memberId) return;
    this.memberStateService.clearSelection();
    this.memberStateService.toggleMemberSelection(this.memberId);
    this.isSendMessageModalOpen = true;
  }

  closeSendMessageModal(): void {
    this.isSendMessageModalOpen = false;
    this.memberStateService.clearSelection();
  }

  openExportModal(): void {
    if (!this.memberId) return;
    this.memberStateService.clearSelection();
    this.memberStateService.toggleMemberSelection(this.memberId);
    this.isExportModalOpen = true;
  }

  closeExportModal(): void {
    this.isExportModalOpen = false;
    this.memberStateService.clearSelection();
  }

  toggleActionsDropdown(event: Event): void {
    event.stopPropagation();
    this.isActionsDropdownOpen = !this.isActionsDropdownOpen;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isActionsDropdownOpen = false;
  }

  onYearChange(event: Event): void {
    const selectedYear = (event.target as HTMLSelectElement).value;
    this.selectedSubscriptionYear = Number(selectedYear);
    console.log(`Subscription year changed to: ${this.selectedSubscriptionYear}.`);
    // TODO: Add logic to refetch subscription data for the selected year.
  }

  // --- Action Handlers ---

  handleSaveRegistration(formData: any): void {
    if (!this.memberId) return;
    const registrationPayload = { ...formData, member: this.memberId };
    this.memberHttpService.register(registrationPayload).subscribe({
      next: () => console.log('Registration successful'), // TODO: Refresh data
      error: (err) => console.error('Registration failed', err)
    });
  }

  onDeleteConfirmed(): void {
    if (!this.memberId) return;
    this.memberHttpService.deleteMember(this.memberId).subscribe({
      next: () => {
        this.toggleDeleteModal();
        this.router.navigate(['/members/list-members']);
      },
      error: (err) => {
        console.error('Failed to delete member', err);
        this.toggleDeleteModal();
      }
    });
  }

  objectToArray(obj: any): { key: string, value: any }[] {
    if (!obj) {
      return [];
    }
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }
}
