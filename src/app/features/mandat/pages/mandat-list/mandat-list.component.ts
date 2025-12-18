import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {MandatHttpService} from '../../services/mandat-http.service';
import {MandatDto} from '../../models/mandat.model';
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-mandat-list',
  standalone: true,
  imports: [CommonModule, NgFor, AsyncPipe],
  templateUrl: './mandat-list.component.html',
  styleUrls: ['./mandat-list.component.scss']
})
export class MandatListComponent implements OnInit {
  mandats$!: Observable<MandatDto[]>;
  isLoading = true;
  hasError = false;

  private mandatHttpService = inject(MandatHttpService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadMandats();
  }

  loadMandats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.mandats$ = this.mandatHttpService.getAllMandats().pipe(
      map(response => response.data), // Extract the data array
      finalize(() => this.isLoading = false),
      catchError((err) => {
        console.error('Error fetching mandats:', err);
        this.notificationService.showError('Erreur lors de la récupération des mandats.');
        this.hasError = true;
        return of([]); // Return an empty array on error
      })
    );
  }

  goToAdd(): void {
    this.router.navigate(['/mandats', 'add']);
  }

  goToEdit(mandatId: string): void {
    this.router.navigate(['/mandats', 'edit', mandatId]);
  }

  goToDetail(mandatId: string): void {
    this.router.navigate(['/mandats', mandatId]);
  }

  deleteMandat(mandatId: string): void {
    // TODO: Implement confirmation modal before deleting
    console.log(`Attempting to delete mandat with ID: ${mandatId}`);
    // this.mandatHttpService.deleteMandat(mandatId).subscribe({
    //   next: () => {
    //     this.notificationService.success('Mandat supprimé avec succès.');
    //     this.loadMandats(); // Refresh the list
    //   },
    //   error: (err) => {
    //     console.error('Error deleting mandat:', err);
    //     this.notificationService.error('Erreur lors de la suppression du mandat.');
    //   }
    // });
  }
}
