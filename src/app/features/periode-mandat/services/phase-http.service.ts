import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {environment} from "../../../../environments/environment";
import {PhaseModel} from "../models/phase.model";
import {UpdatePhaseModel} from "../models/UpdatePhaseModel";

@Injectable({
  providedIn: 'root'
})
export class PhaseHttpService {
  private readonly url = `${environment.API_URL}/phases`;
  http = inject(HttpClient);

  public getActivePhase(): Observable<ResponseEntityApi<PhaseModel>> {
    return this.http.get<ResponseEntityApi<PhaseModel>>(`${this.url}/active`);
  }

  public getMandatPhases(mandatId: string): Observable<PhaseModel[]> {
    return this.http.get<ResponseEntityApi<PhaseModel[]>>(`${this.url}/periode-mandat/${mandatId}`).pipe(
      map(response => response.data)
    );
  }

  public getPhaseById(id: string): Observable<ResponseEntityApi<PhaseModel>> {
    return this.http.get<ResponseEntityApi<PhaseModel>>(`${this.url}/${id}`);
  }

  public updatePhase(id: string, payload: UpdatePhaseModel): Observable<PhaseModel> {
    return this.http.put<ResponseEntityApi<PhaseModel>>(`${this.url}/${id}`, payload).pipe(
      map(response => response.data)
    );
  }
  public deletePhaseById(id: string): Observable<ResponseEntityApi<void>> {
    return this.http.get<ResponseEntityApi<void>>(`${this.url}/${id}`);
  }
}
