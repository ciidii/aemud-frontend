import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {environment} from "../../../../environments/environment";
import {MandatDto} from "../models/mandat.model";
import {CreateMandatModel} from "../models/CreateMandatModel";

@Injectable({
  providedIn: 'root'
})
export class MandatHttpService {
  http = inject(HttpClient);
  url = environment.API_URL;

  public getActiveMandat(): Observable<ResponseEntityApi<MandatDto>> {
    return this.http.get<ResponseEntityApi<MandatDto>>(`${this.url}/mandats/active`);
  }

  public getAllMandats(): Observable<ResponseEntityApi<MandatDto[]>> {
    return this.http.get<ResponseEntityApi<MandatDto[]>>(`${this.url}/mandats`);
  }

  public createMandat(mandat: CreateMandatModel): Observable<ResponseEntityApi<MandatDto>> {
    return this.http.post<ResponseEntityApi<MandatDto>>(`${this.url}/mandats`, mandat);
  }

  public updateMandat(id: string, mandat: CreateMandatModel): Observable<ResponseEntityApi<MandatDto>> {
    return this.http.put<ResponseEntityApi<MandatDto>>(`${this.url}/mandats/${id}`, mandat);
  }

  public getMandatById(id: string): Observable<ResponseEntityApi<MandatDto>> {
    return this.http.get<ResponseEntityApi<MandatDto>>(`${this.url}/mandats/${id}`);
  }

  public deleteMandat(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/mandats/${id}`);
  }
}
