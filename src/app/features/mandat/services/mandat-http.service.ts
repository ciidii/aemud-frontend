import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {environment} from "../../../../environments/environment";
import {MandatDto} from "../models/mandat.model";

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
}
