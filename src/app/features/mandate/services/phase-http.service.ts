import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {PhaseModel, UpdatePhaseModel} from '../models/phase.model';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';

@Injectable({
  providedIn: 'root'
})
export class PhaseHttpService {
  private readonly url = `${environment.API_URL}/phases`;
  private http = inject(HttpClient);

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
    return this.http.delete<ResponseEntityApi<void>>(`${this.url}/${id}`);
  }

  public openRegistrationCampaign(phaseId: string, startDate: string, endDate: string): Observable<ResponseEntityApi<void>> {
    return this.http.patch<ResponseEntityApi<void>>(`${this.url}/${phaseId}/open-registrations`, {
      startDate,
      endDate
    });
  }

  public prolongRegistrationCampaign(phaseId: string, newEndDate: string, motif: string): Observable<ResponseEntityApi<void>> {
    return this.http.patch<ResponseEntityApi<void>>(`${this.url}/${phaseId}/prolong-registrations`, {
      newEndDate,
      motif
    });
  }

  public closeRegistrationCampaign(phaseId: string): Observable<ResponseEntityApi<void>> {
    return this.http.patch<ResponseEntityApi<void>>(`${this.url}/${phaseId}/close-registrations`, {});
  }
}
