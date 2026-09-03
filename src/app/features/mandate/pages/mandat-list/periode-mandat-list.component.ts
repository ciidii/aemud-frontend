import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgFor, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {MandateHttpService} from '../../services/mandate-http.service';
import {MandateModel, PeriodeMandatDto} from '../../models/mandate.model';
import {NotificationService} from '../../../../core/services/notification.service';
import {AppStateService} from '../../../../core/services/app-state.service';
import {ConfirmDeleteModalComponent} from '../../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';

export type MandatFilterTab = 'ALL' | 'ACTIVE' | 'DRAFT_UPCOMING' | 'ARCHIVED';

@Component({
  selector: 'app-periode-mandat-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe, FormsModule, ConfirmDeleteModalComponent],
  templateUrl: './periode-mandat-list.component.html',
  styleUrls: ['./periode-mandat-list.component.scss']
})
export class PeriodeMandatListComponent implements OnInit {
  allMandats: MandateModel[] = [];
  filteredMandats: MandateModel[] = [];
  selectedTab: MandatFilterTab = 'ALL';
  searchTerm = '';

  activeMandat: MandateModel | null = null;

  isLoading = true;
  hasError = false;
  isActivatingId: string | null = null;
  isDeleteModalOpen = false;
  mandatToDelete: PeriodeMandatDto | null = null;

  statusTabs: { value: MandatFilterTab; label: string; icon: string }[] = [
    { value: 'ALL', label: 'Tous les Mandats', icon: 'bi-grid-fill' },
    { value: 'ACTIVE', label: 'Mandat Actif', icon: 'bi-lightning-charge-fill' },
    { value: 'DRAFT_UPCOMING', label: 'Brouillons & À venir', icon: 'bi-hourglass-split' },
    { value: 'ARCHIVED', label: 'Archivés', icon: 'bi-archive-fill' }
  ];

  private mandateHttpService = inject(MandateHttpService);
  private appStateService = inject(AppStateService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadPeriodeMandats();
  }

  loadPeriodeMandats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.mandateHttpService.getAllMandates().pipe(
      map(response => response.data || []),
      finalize(() => this.isLoading = false),
      catchError((err) => {
        console.error('Error fetching periode mandats:', err);
        this.notificationService.showError('Erreur lors de la récupération des périodes de mandat.');
        this.hasError = true;
        return of([]);
      })
    ).subscribe(mandats => {
      this.allMandats = mandats;
      this.activeMandat = mandats.find(m => m.status === 'ACTIVE' || m.estActif) || null;
      this.applyFilter();
    });
  }

  setFilterTab(tab: MandatFilterTab): void {
    this.selectedTab = tab;
    this.applyFilter();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  getTabCount(tab: MandatFilterTab): number {
    switch (tab) {
      case 'ALL':
        return this.allMandats.length;
      case 'ACTIVE':
        return this.allMandats.filter(m => m.status === 'ACTIVE' || m.estActif).length;
      case 'DRAFT_UPCOMING':
        return this.allMandats.filter(m => m.status === 'DRAFT' || m.status === 'UPCOMING').length;
      case 'ARCHIVED':
        return this.allMandats.filter(m => m.status === 'CLOSED_ARCHIVED' || (!m.estActif && m.status !== 'DRAFT' && m.status !== 'UPCOMING')).length;
      default:
        return 0;
    }
  }

  applyFilter(): void {
    let result = [...this.allMandats];

    // Status filter
    if (this.selectedTab === 'ACTIVE') {
      result = result.filter(m => m.status === 'ACTIVE' || m.estActif);
    } else if (this.selectedTab === 'DRAFT_UPCOMING') {
      result = result.filter(m => m.status === 'DRAFT' || m.status === 'UPCOMING');
    } else if (this.selectedTab === 'ARCHIVED') {
      result = result.filter(m => m.status === 'CLOSED_ARCHIVED' || (!m.estActif && m.status !== 'DRAFT' && m.status !== 'UPCOMING'));
    }

    // Search filter
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(m => {
        const nomMatches = m.nom ? m.nom.toLowerCase().includes(term) : false;
        const phaseMatches = m.phases ? m.phases.some(p => p.nom && p.nom.toLowerCase().includes(term)) : false;
        return nomMatches || phaseMatches;
      });
    }

    this.filteredMandats = result;
  }

  getMandatStatusBadge(mandat: PeriodeMandatDto): { label: string; class: string; icon: string } {
    const status = mandat.status || (mandat.estActif ? 'ACTIVE' : 'CLOSED_ARCHIVED');
    switch (status) {
      case 'ACTIVE':
        return { label: 'Mandat Actif', class: 'badge-active', icon: 'bi-check-circle-fill' };
      case 'DRAFT':
        return { label: 'Brouillon', class: 'badge-draft', icon: 'bi-pencil-fill' };
      case 'UPCOMING':
        return { label: 'À venir', class: 'badge-upcoming', icon: 'bi-calendar-plus' };
      case 'CLOSED_ARCHIVED':
      default:
        return { label: 'Archivé', class: 'badge-archived', icon: 'bi-archive-fill' };
    }
  }

  getPhaseStatusBadge(phase: any): { label: string; class: string } {
    const s = phase.status ? phase.status.toUpperCase() : 'FUTURE';
    switch (s) {
      case 'CURRENT':
      case 'ACTIVE':
        return { label: 'En cours', class: 'phase-active' };
      case 'EXTENDED':
        return { label: 'Prolongée', class: 'phase-extended' };
      case 'CLOSED':
      case 'PASSED':
        return { label: 'Clôturée', class: 'phase-closed' };
      case 'FUTURE':
      case 'PLANNED':
      default:
        return { label: 'À venir', class: 'phase-planned' };
    }
  }

  goToAdd(): void {
    this.router.navigate(['/mandats', 'add']);
  }

  goToEdit(periodeMandatId: string, event?: Event): void {
    if (event) event.stopPropagation();
    this.router.navigate(['/mandats', 'edit', periodeMandatId]);
  }

  goToDetail(periodeMandatId: string): void {
    this.router.navigate(['/mandats', periodeMandatId]);
  }

  activateMandat(mandat: MandateModel, event: Event): void {
    event.stopPropagation();
    if (mandat.status === 'ACTIVE' || mandat.estActif) return;

    this.isActivatingId = mandat.id;
    this.mandateHttpService.activateMandate(mandat.id).subscribe({
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

    this.mandateHttpService.deleteMandate(id).subscribe({
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
