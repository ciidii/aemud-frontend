import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {Club} from '../../../../core/models/member-data.model';
import {ClubService} from '../../services/club.service';
import {SkeletonLoaderComponent} from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';
import {ClubFormComponent} from '../club-form/club-form.component';
import {ConfirmDeleteModalComponent} from '../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-club-admin',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent, ModalComponent, ClubFormComponent, ConfirmDeleteModalComponent],
  templateUrl: './club-admin.component.html',
  styleUrls: ['./club-admin.component.css']
})
export class ClubAdminComponent implements OnInit {
  clubs$!: Observable<Club[]>;
  private refresh$ = new BehaviorSubject<void>(undefined);

  isModalOpen = false;
  isConfirmOpen = false;
  isSaving = false;
  selectedClub: Club | null = null;

  constructor(private clubService: ClubService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubs$ = this.refresh$.pipe(
      switchMap(() => this.clubService.getAllClubs())
    );
  }

  openClubModal(club: Club | null = null): void {
    this.selectedClub = club;
    this.isModalOpen = true;
  }

  closeClubModal(): void {
    this.isModalOpen = false;
    this.selectedClub = null;
  }

  onSaveClub(clubData: Club): void {
    this.isSaving = true;
    const saveOperation = clubData.id
      ? this.clubService.updateClub(clubData)
      : this.clubService.createClub(clubData);

    saveOperation.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Club ${clubData.id ? 'modifié' : 'créé'} avec succès.`);
        this.refresh$.next();
        this.closeClubModal();
      },
      error: () => this.notificationService.showError('Erreur lors de la sauvegarde du club.'),
      complete: () => this.isSaving = false
    });
  }

  openDeleteConfirm(club: Club): void {
    this.selectedClub = club;
    this.isConfirmOpen = true;
  }

  closeDeleteConfirm(): void {
    this.isConfirmOpen = false;
    this.selectedClub = null;
  }

  onDeleteClub(): void {
    if (!this.selectedClub || !this.selectedClub.id) return;

    this.clubService.deleteClub(this.selectedClub.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Club supprimé avec succès.');
        this.refresh$.next();
        this.closeDeleteConfirm();
      },
      error: () => this.notificationService.showError('Erreur lors de la suppression du club.')
    });
  }
}
