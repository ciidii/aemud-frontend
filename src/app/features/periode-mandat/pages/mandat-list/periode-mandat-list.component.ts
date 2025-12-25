import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {PeriodeMandatHttpService} from '../../services/periode-mandat-http.service';
import {PeriodeMandatDto} from '../../models/periode-mandat.model';
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-periode-mandat-list',
  standalone: true,
  imports: [CommonModule, NgFor, AsyncPipe],
  templateUrl: './periode-mandat-list.component.html',
  styleUrls: ['./periode-mandat-list.component.scss']
})
export class PeriodeMandatListComponent implements OnInit {
  periodeMandats$!: Observable<PeriodeMandatDto[]>;
  isLoading = true;
  hasError = false;

  private periodeMandatHttpService = inject(PeriodeMandatHttpService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadPeriodeMandats();
  }

  loadPeriodeMandats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.periodeMandats$ = this.periodeMandatHttpService.getAllPeriodeMandats().pipe(
      map(response => response.data), // Extract the data array
      finalize(() => this.isLoading = false),
      catchError((err) => {
        console.error('Error fetching periode mandats:', err);
        this.notificationService.showError('Erreur lors de la récupération des périodes de mandat.');
        this.hasError = true;
        return of([]); // Return an empty array on error
      })
    );
  }

  goToAdd(): void {
    this.router.navigate(['/periode-mandats', 'add']);
  }

  goToEdit(periodeMandatId: string): void {
    this.router.navigate(['/periode-mandats', 'edit', periodeMandatId]);
  }

  goToDetail(periodeMandatId: string): void {
    this.router.navigate(['/periode-mandats', periodeMandatId]);
  }

  deletePeriodeMandat(periodeMandatId: string): void {
    // TODO: Implement confirmation modal before deleting
    console.log(`Attempting to delete periode mandat with ID: ${periodeMandatId}`);
    // this.periodeMandatHttpService.deletePeriodeMandat(periodeMandatId).subscribe({
    //   next: () => {
    //     this.notificationService.success('Période de mandat supprimée avec succès.');
    //     this.loadPeriodeMandats(); // Refresh the list
    //   },
    //   error: (err) => {
    //     console.error('Error deleting periode mandat:', err);
    //     this.notificationService.error('Erreur lors de la suppression de la période de mandat.');
    //   }
    // });
  }

  public dateArrayToString(dateArray: [number, number, number]): string {
    const [year, month, day] = dateArray;
    const pad = (num: number) => num < 10 ? '0' + num : '' + num;
    return `${year}-${pad(month)}-${pad(day)}`;
  }
}
