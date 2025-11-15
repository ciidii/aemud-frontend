import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {MandatDto} from "../models/mandat.model";


@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private readonly _activeMandat: BehaviorSubject<MandatDto | null> = new BehaviorSubject<MandatDto | null>(null);
  public readonly activeMandat$: Observable<MandatDto | null> = this._activeMandat.asObservable();

  private readonly _mandats$: BehaviorSubject<MandatDto[]> = new BehaviorSubject<MandatDto[]>([]);
  public readonly mandats$: Observable<MandatDto[]> = this._mandats$.asObservable();

  setSelectedMandat(mandat: MandatDto): void {
    this._activeMandat.next(mandat);
  }

  setMandats(mandats: MandatDto[]): void {
    this._mandats$.next(mandats);
  }
}
