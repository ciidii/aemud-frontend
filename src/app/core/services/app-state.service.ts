import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, shareReplay, tap} from "rxjs";
import {PeriodeMandatDto} from "../../features/configuration/periode-mandat/models/periode-mandat.model";
import {
  PeriodeMandatHttpService
} from "../../features/configuration/periode-mandat/services/periode-mandat-http.service";


@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private readonly _activeMandat: BehaviorSubject<PeriodeMandatDto | null> = new BehaviorSubject<PeriodeMandatDto | null>(null);
  public readonly activeMandat$: Observable<PeriodeMandatDto | null> = this._activeMandat.asObservable();

  private readonly _mandats$: BehaviorSubject<PeriodeMandatDto[]> = new BehaviorSubject<PeriodeMandatDto[]>([]);
  public readonly mandats$: Observable<PeriodeMandatDto[]> = this._mandats$.asObservable();

  private mandatHttpService = inject(PeriodeMandatHttpService);
  private initialLoad$?: Observable<PeriodeMandatDto | null>;

  /**
   * Charge la liste des mandats et sélectionne automatiquement le mandat actif par défaut.
   */
  public loadInitialMandat(): Observable<PeriodeMandatDto | null> {
    if (this._activeMandat.value) {
      return of(this._activeMandat.value);
    }
    if (this.initialLoad$) {
      return this.initialLoad$;
    }

    this.initialLoad$ = this.mandatHttpService.getAllPeriodeMandats().pipe(
      map(response => {
        const mandats = response.data || [];
        this._mandats$.next(mandats);

        // Sélection automatique du mandat actif (ou premier mandat disponible)
        const active = mandats.find(m => m.estActif) || (mandats.length > 0 ? mandats[0] : null);
        if (active && !this._activeMandat.value) {
          this._activeMandat.next(active);
        }
        return this._activeMandat.value;
      }),
      catchError(err => {
        console.warn('Impossible de charger les mandats initiaux:', err);
        return of(null);
      }),
      shareReplay(1)
    );

    return this.initialLoad$;
  }

  setSelectedMandat(mandat: PeriodeMandatDto | null): void {
    this._activeMandat.next(mandat);
  }

  setMandats(mandats: PeriodeMandatDto[]): void {
    this._mandats$.next(mandats);
  }

  getActiveMandatValue(): PeriodeMandatDto | null {
    return this._activeMandat.value;
  }
}
