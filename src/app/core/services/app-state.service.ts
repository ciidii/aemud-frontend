import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {PeriodeMandatDto} from "../../features/periode-mandat/models/periode-mandat.model";


@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private readonly _activeMandat: BehaviorSubject<PeriodeMandatDto | null> = new BehaviorSubject<PeriodeMandatDto | null>(null);
  public readonly activeMandat$: Observable<PeriodeMandatDto | null> = this._activeMandat.asObservable();

  private readonly _mandats$: BehaviorSubject<PeriodeMandatDto[]> = new BehaviorSubject<PeriodeMandatDto[]>([]);
  public readonly mandats$: Observable<PeriodeMandatDto[]> = this._mandats$.asObservable();

  setSelectedMandat(mandat: PeriodeMandatDto): void {
    this._activeMandat.next(mandat);
  }

  setMandats(mandats: PeriodeMandatDto[]): void {
    this._mandats$.next(mandats);
  }
}
