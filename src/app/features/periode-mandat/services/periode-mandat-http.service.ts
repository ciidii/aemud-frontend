import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {environment} from "../../../../environments/environment";
import {PeriodeMandatDto} from "../models/periode-mandat.model";
import {CreatePeriodeMandatModel} from "../models/CreatePeriodeMandatModel";

@Injectable({
  providedIn: 'root'
})
export class PeriodeMandatHttpService {
  http = inject(HttpClient);
  url = environment.API_URL;

  public getActivePeriodeMandat(): Observable<ResponseEntityApi<PeriodeMandatDto>> {
    return this.http.get<ResponseEntityApi<PeriodeMandatDto>>(`${this.url}/periode-mandats/active`);
  }

  public getAllPeriodeMandats(): Observable<ResponseEntityApi<PeriodeMandatDto[]>> {
    return this.http.get<ResponseEntityApi<PeriodeMandatDto[]>>(`${this.url}/periode-mandats`);
  }

  public createPeriodeMandat(periodeMandat: CreatePeriodeMandatModel): Observable<ResponseEntityApi<PeriodeMandatDto>> {
    return this.http.post<ResponseEntityApi<PeriodeMandatDto>>(`${this.url}/periode-mandats`, periodeMandat);
  }

  public updatePeriodeMandat(id: string, periodeMandat: CreatePeriodeMandatModel): Observable<ResponseEntityApi<PeriodeMandatDto>> {
    return this.http.put<ResponseEntityApi<PeriodeMandatDto>>(`${this.url}/periode-mandats/${id}`, periodeMandat);
  }

  public getPeriodeMandatById(id: string): Observable<ResponseEntityApi<PeriodeMandatDto>> {
    return this.http.get<ResponseEntityApi<PeriodeMandatDto>>(`${this.url}/periode-mandats/${id}`);
  }

  public deletePeriodeMandat(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/periode-mandats/${id}`);
  }
}
