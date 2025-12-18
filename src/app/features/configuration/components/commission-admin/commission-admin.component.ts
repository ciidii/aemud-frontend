import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {Commission} from '../../../../core/models/member-data.model';
import {CommissionService} from '../../services/commission.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {SkeletonLoaderComponent} from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';
import {ConfirmDeleteModalComponent} from '../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';
import {CommissionFormComponent} from '../commission-form/commission-form.component';

@Component({
  selector: 'app-commission-admin',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent, ModalComponent, CommissionFormComponent, ConfirmDeleteModalComponent],
  templateUrl: './commission-admin.component.html',
  styleUrls: ['./commission-admin.component.css']
})
export class CommissionAdminComponent implements OnInit {
  commissions$!: Observable<Commission[]>;
  private refresh$ = new BehaviorSubject<void>(undefined);

  isModalOpen = false;
  isConfirmOpen = false;
  isSaving = false;
  selectedCommission: Commission | null = null;

  constructor(private commissionService: CommissionService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadCommissions();
  }

  loadCommissions(): void {
    this.commissions$ = this.refresh$.pipe(
      switchMap(() => this.commissionService.getAllCommissions())
    );
  }

  openCommissionModal(commission: Commission | null = null): void {
    this.selectedCommission = commission;
    this.isModalOpen = true;
  }

  closeCommissionModal(): void {
    this.isModalOpen = false;
    this.selectedCommission = null;
  }

  onSaveCommission(commissionData: Commission): void {
    this.isSaving = true;
    const saveOperation = commissionData.id
      ? this.commissionService.updateCommission(commissionData)
      : this.commissionService.createCommission(commissionData);

    saveOperation.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Commission ${commissionData.id ? 'modifiée' : 'créée'} avec succès.`);
        this.refresh$.next();
        this.closeCommissionModal();
      },
      error: () => this.notificationService.showError('Erreur lors de la sauvegarde de la commission.'),
      complete: () => this.isSaving = false
    });
  }

  openDeleteConfirm(commission: Commission): void {
    this.selectedCommission = commission;
    this.isConfirmOpen = true;
  }

  closeDeleteConfirm(): void {
    this.isConfirmOpen = false;
    this.selectedCommission = null;
  }

  onDeleteCommission(): void {
    if (!this.selectedCommission || !this.selectedCommission.id) return;

    this.commissionService.deleteCommission(this.selectedCommission.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Commission supprimée avec succès.');
        this.refresh$.next();
        this.closeDeleteConfirm();
      },
      error: () => this.notificationService.showError('Erreur lors de la suppression de la commission.')
    });
  }
}
