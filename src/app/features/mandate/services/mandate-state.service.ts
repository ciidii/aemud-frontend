import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {MandateModel} from '../models/mandate.model';
import {MandateHttpService} from './mandate-http.service';

@Injectable({
  providedIn: 'root'
})
export class MandateStateService {
  private mandateHttpService = inject(MandateHttpService);

  private activeMandateSubject = new BehaviorSubject<MandateModel | null>(null);
  public activeMandate$: Observable<MandateModel | null> = this.activeMandateSubject.asObservable();

  private allMandatesSubject = new BehaviorSubject<MandateModel[]>([]);
  public allMandates$: Observable<MandateModel[]> = this.allMandatesSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  public loadAllMandates(): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.mandateHttpService.getAllMandates().pipe(
      tap({
        next: (response) => {
          const list = response.data || [];
          this.allMandatesSubject.next(list);
          const active = list.find(m => m.status === 'ACTIVE' || m.estActif);
          this.activeMandateSubject.next(active || null);
          this.isLoadingSubject.next(false);
        },
        error: () => {
          this.isLoadingSubject.next(false);
        }
      })
    );
  }

  public setActiveMandate(mandate: MandateModel | null): void {
    this.activeMandateSubject.next(mandate);
  }
}
