import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../models/response-entity-api";
import {SessionModel} from "../models/session.model";
import {environment} from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class ContactInfoService {

  constructor(private http: HttpClient) {
  }

  public getCurrentYear(): Observable<ResponseEntityApi<SessionModel>> {
    return this.http.get<ResponseEntityApi<SessionModel>>(environment.API_URL + '/session/current');
  }
}
