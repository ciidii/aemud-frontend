import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {environment} from "../../../../environments/environment";
import {PhaseModel} from "../../../core/models/phase.model";

@Injectable({
  providedIn: 'root'
})
export class PhaseHttpService {
  http = inject(HttpClient);

  public getActivePhase(): Observable<ResponseEntityApi<PhaseModel>> {
    return this.http.get<ResponseEntityApi<PhaseModel>>(environment.API_URL + '/phases/active');
  }

  public getMandatPhases(mandatId: string): Observable<PhaseModel[]> {
    return this.http.get<ResponseEntityApi<PhaseModel[]>>(`${environment.API_URL}/phases/mandat/${mandatId}`).pipe(
      map(response => response.data)
    );
  }
}
