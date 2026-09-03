import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MandateModel, CreateMandateModel} from '../models/mandate.model';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';

@Injectable({
  providedIn: 'root'
})
export class MandateHttpService {
  private http = inject(HttpClient);
  private url = environment.API_URL;

  public getActiveMandate(): Observable<ResponseEntityApi<MandateModel>> {
    return this.http.get<ResponseEntityApi<MandateModel>>(`${this.url}/periode-mandats/active`);
  }

  public getAllMandates(): Observable<ResponseEntityApi<MandateModel[]>> {
    return this.http.get<ResponseEntityApi<MandateModel[]>>(`${this.url}/periode-mandats`);
  }

  public createMandate(mandate: CreateMandateModel): Observable<ResponseEntityApi<MandateModel>> {
    return this.http.post<ResponseEntityApi<MandateModel>>(`${this.url}/periode-mandats`, mandate);
  }

  public updateMandate(id: string, mandate: CreateMandateModel): Observable<ResponseEntityApi<MandateModel>> {
    return this.http.put<ResponseEntityApi<MandateModel>>(`${this.url}/periode-mandats/${id}`, mandate);
  }

  public getMandateById(id: string): Observable<ResponseEntityApi<MandateModel>> {
    return this.http.get<ResponseEntityApi<MandateModel>>(`${this.url}/periode-mandats/${id}`);
  }

  public deleteMandate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/periode-mandats/${id}`);
  }

  public activateMandate(id: string): Observable<ResponseEntityApi<MandateModel>> {
    return this.http.patch<ResponseEntityApi<MandateModel>>(`${this.url}/periode-mandats/${id}/activate`, {});
  }

  public updateMandateStatus(id: string, status: string): Observable<ResponseEntityApi<MandateModel>> {
    return this.http.patch<ResponseEntityApi<MandateModel>>(`${this.url}/periode-mandats/${id}/status?status=${status}`, {});
  }

  // Backward compatibility methods
  public getActivePeriodeMandat(): Observable<ResponseEntityApi<MandateModel>> {
    return this.getActiveMandate();
  }

  public getAllPeriodeMandats(): Observable<ResponseEntityApi<MandateModel[]>> {
    return this.getAllMandates();
  }

  public createPeriodeMandat(periodeMandat: CreateMandateModel): Observable<ResponseEntityApi<MandateModel>> {
    return this.createMandate(periodeMandat);
  }

  public updatePeriodeMandat(id: string, periodeMandat: CreateMandateModel): Observable<ResponseEntityApi<MandateModel>> {
    return this.updateMandate(id, periodeMandat);
  }

  public getPeriodeMandatById(id: string): Observable<ResponseEntityApi<MandateModel>> {
    return this.getMandateById(id);
  }

  public deletePeriodeMandat(id: string): Observable<void> {
    return this.deleteMandate(id);
  }

  public activatePeriodeMandat(id: string): Observable<ResponseEntityApi<MandateModel>> {
    return this.activateMandate(id);
  }
}

// Backward compatibility alias
export {MandateHttpService as PeriodeMandatHttpService};
