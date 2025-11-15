import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from 'src/app/core/models/response-entity-api';
import {SessionModel} from "../models/session.model";
import {MonthDataModel} from "../models/month-data.model";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class YearOfSessionService {

  constructor(private http: HttpClient) {
  }

  public getCurrentYear(): Observable<ResponseEntityApi<SessionModel>> {
    return this.http.get<ResponseEntityApi<SessionModel>>(environment.API_URL + '/session/current');
  }

  public openNewSession(year: SessionModel): Observable<ResponseEntityApi<SessionModel>> {
    const body = year;
    return this.http.post<ResponseEntityApi<SessionModel>>(environment.API_URL + "/session", body);
  }

  public getYears(): Observable<ResponseEntityApi<SessionModel[]>> {
    return this.http.get<ResponseEntityApi<SessionModel[]>>(environment.API_URL + '/session/all');
  }

  public getPaticulerYear(sessionId: string): Observable<ResponseEntityApi<SessionModel>> {
    const params = new HttpParams().set("sessionid", sessionId);
    return this.http.get<ResponseEntityApi<SessionModel>>(environment.API_URL + '/session', {params});
  }

  public checkIfCanDeleteSession(sessionId: number): Observable<ResponseEntityApi<boolean>> {
    const params = new HttpParams().set("sessionid", sessionId);

    return this.http.get<ResponseEntityApi<boolean>>(environment.API_URL + '/session/check', {params});
  }

  deleletSession(id: string): Observable<ResponseEntityApi<void>> {
    const params = new HttpParams().set("sessionid", id);
    return this.http.delete<ResponseEntityApi<void>>(environment.API_URL + '/session', {params})
  }

  public getElevenMonths(): Observable<ResponseEntityApi<MonthDataModel[]>> {
    return this.http.get<ResponseEntityApi<MonthDataModel[]>>(environment.API_URL + '/month');
  }
}
