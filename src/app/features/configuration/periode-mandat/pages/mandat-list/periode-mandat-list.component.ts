import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgFor, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {PeriodeMandatHttpService} from '../../services/periode-mandat-http.service';
import {PeriodeMandatDto} from '../../models/periode-mandat.model';
import {NotificationService} from "../../../../../core/services/notification.service";
import {AppStateService} from "../../../../../core/services/app-state.service";
import {ConfirmDeleteModalComponent} from "../../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";

@Component({
  selector: 'app-periode-mandat-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe, ConfirmDeleteModalComponent],
  templateUrl: './periode-mandat-list.component.html',
  styleUrls: ['./periode-mandat-list.component.scss']
})
export class PeriodeMandatListComponent implements OnInit {
  periodeMandats$!: Observable<PeriodeMandatDto[]>;
  isLoading = true;
  hasError = false;
  isActivatingId: string | null = null;
  isDeleteModalOpen = false;
  mandatToDelete: PeriodeMandatDto | null = null;

  private periodeMandatHttpService = inject(PeriodeMandatHttpService);
  private appStateService = inject(AppStateService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadPeriodeMandats();
  }

  loadPeriodeMandats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.periodeMandats$ = this.periodeMandatHttpService.getAllPeriodeMandats().pipe(
      map(response => response.data || []),
      finalize(() => this.isLoading = false),
      catchError((err) => {
        console.error('Error fetching periode mandats:', err);
        this.notificationService.showError('Erreur lors de la récupération des périodes de mandat.');
        this.hasError = true;
        return of([]);
      })
    );
  }

  goToAdd(): void {
    this.router.navigate(['/periode-mandats', 'add']);
  }

  goToEdit(periodeMandatId: string, event?: Event): void {
    if (event) event.stopPropagation();
    this.router.navigate(['/periode-mandats', 'edit', periodeMandatId]);
  }

  goToDetail(periodeMandatId: string): void {
    this.router.navigate(['/periode-mandats', periodeMandatId]);
  }

  activateMandat(mandat: PeriodeMandatDto, event: Event): void {
    event.stopPropagation();
    if (mandat.estActif) return;

    this.isActivatingId = mandat.id;
    this.periodeMandatHttpService.activatePeriodeMandat(mandat.id).subscribe({
      next: (res) => {
        this.isActivatingId = null;
        this.notificationService.showSuccess(`Le mandat "${mandat.nom}" est désormais le mandat actif.`);
        if (res.data) {
          this.appStateService.setSelectedMandat(res.data);
        }
        this.loadPeriodeMandats();
      },
      error: (err) => {
        this.isActivatingId = null;
        this.notificationService.showError("Impossible d'activer ce mandat.");
        console.error('Failed to activate mandat', err);
      }
    });
  }

  openDeleteModal(mandat: PeriodeMandatDto, event: Event): void {
    event.stopPropagation();
    this.mandatToDelete = mandat;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.mandatToDelete = null;
  }

  confirmDelete(): void {
    if (!this.mandatToDelete) return;

    const id = this.mandatToDelete.id;
    const name = this.mandatToDelete.nom;

    this.periodeMandatHttpService.deletePeriodeMandat(id).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Le mandat "${name}" a été supprimé avec succès.`);
        this.closeDeleteModal();
        this.loadPeriodeMandats();
      },
      error: (err) => {
        this.notificationService.showError("Erreur lors de la suppression du mandat.");
        console.error('Failed to delete mandat', err);
        this.closeDeleteModal();
      }
    });
  }

  public dateArrayToString(dateArray: [number, number, number]): string {
    if (!dateArray) return '';
    const [year, month, day] = dateArray;
    const pad = (num: number) => num < 10 ? '0' + num : '' + num;
    return `${year}-${pad(month)}-${pad(day)}`;
  }
}
