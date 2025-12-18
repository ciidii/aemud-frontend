import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {BourseModel} from '../../../../core/models/bourse.model';
import {BourseService} from '../../services/bourse.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {SkeletonLoaderComponent} from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';
import {ConfirmDeleteModalComponent} from '../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';
import {BourseFormComponent} from '../bourse-form/bourse-form.component';

@Component({
  selector: 'app-bourse-admin',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent, ModalComponent, BourseFormComponent, ConfirmDeleteModalComponent],
  templateUrl: './bourse-admin.component.html',
  styleUrls: ['./bourse-admin.component.css']
})
export class BourseAdminComponent implements OnInit {
  bourses$!: Observable<BourseModel[]>;
  private refresh$ = new BehaviorSubject<void>(undefined);

  isModalOpen = false;
  isConfirmOpen = false;
  isSaving = false;
  selectedBourse: BourseModel | null = null;

  constructor(private bourseService: BourseService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadBourses();
  }

  loadBourses(): void {
    this.bourses$ = this.refresh$.pipe(
      switchMap(() => this.bourseService.getAllBourses())
    );
  }

  openBourseModal(bourse: BourseModel | null = null): void {
    this.selectedBourse = bourse;
    this.isModalOpen = true;
  }

  closeBourseModal(): void {
    this.isModalOpen = false;
    this.selectedBourse = null;
  }

  onSaveBourse(bourseData: BourseModel): void {
    this.isSaving = true;
    const saveOperation = bourseData.id
      ? this.bourseService.updateBourse(bourseData)
      : this.bourseService.createBourse(bourseData);

    saveOperation.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Bourse ${bourseData.id ? 'modifiée' : 'créée'} avec succès.`);
        this.refresh$.next();
        this.closeBourseModal();
      },
      error: () => this.notificationService.showError('Erreur lors de la sauvegarde de la bourse.'),
      complete: () => this.isSaving = false
    });
  }

  openDeleteConfirm(bourse: BourseModel): void {
    this.selectedBourse = bourse;
    this.isConfirmOpen = true;
  }

  closeDeleteConfirm(): void {
    this.isConfirmOpen = false;
    this.selectedBourse = null;
  }

  onDeleteBourse(): void {
    if (!this.selectedBourse || !this.selectedBourse.id) return;

    this.bourseService.deleteBourse(this.selectedBourse.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Bourse supprimée avec succès.');
        this.refresh$.next();
        this.closeDeleteConfirm();
      },
      error: () => this.notificationService.showError('Erreur lors de la suppression de la bourse.')
    });
  }
}
