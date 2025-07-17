import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MemberModel } from "../models/member.model";

export interface MemberState {
  members: MemberModel[];
  keyword: string;
  criteria: string;
  filters: {
    club: string | null;
    year: number | null;
    commission: string | null;
  };
  totalPages: number;
  pageSize: number;
  currentPage: number;
  status: string;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // 1. L'état initial
  private readonly initialState: MemberState = {
    members: [],
    keyword: "",
    criteria: "",
    filters: {
      club: null,
      year: null,
      commission: null,
    },
    totalPages: 0,
    pageSize: 10,
    currentPage: 1,
    status: "",
    errorMessage: ""
  };


  private readonly _memberState$ = new BehaviorSubject<MemberState>(this.initialState);

  // 3. L'Observable public que les composants vont consommer
  memberState$: Observable<MemberState> = this._memberState$.asObservable();


  // 4. Méthode de mise à jour contrôlée
  public setMemberState(newState: Partial<MemberState>): void {
    // On récupère la valeur actuelle
    const currentState = this._memberState$.getValue();
    // On crée le nouvel état en fusionnant l'ancien et le nouveau
    const updatedState = { ...currentState, ...newState };
    // On publie le nouvel état à tous les abonnés
    this._memberState$.next(updatedState);
  }

  // Optionnel : des "selectors" pour accéder facilement à des parties de l'état
  public getCurrentPage(): number {
    return this._memberState$.getValue().currentPage;
  }

  public getSnapshot(): MemberState {
    return this._memberState$.getValue();
  }
}
