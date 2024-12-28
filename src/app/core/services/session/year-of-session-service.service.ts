import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../models/responseEntityApi";
import {YearOfSessionResponse} from "../../models/session/YearOfSessionResponse";
import {environment} from "../../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class YearOfSessionServiceService {

  constructor(private http: HttpClient) {
  }

  public getCurrentYear(): Observable<ResponseEntityApi<YearOfSessionResponse>> {
    return this.http.get<ResponseEntityApi<YearOfSessionResponse>>(environment.API_URL + '/session/current');
  }

  public openNewSession(year: any): Observable<ResponseEntityApi<YearOfSessionResponse>> {
    const body = year;
    return this.http.post<ResponseEntityApi<YearOfSessionResponse>>(environment.API_URL + "/session", body);
  }

  public getYears(): Observable<ResponseEntityApi<Array<YearOfSessionResponse>>> {
    return this.http.get<ResponseEntityApi<Array<YearOfSessionResponse>>>(environment.API_URL + '/session/all');
  }

  public getPaticulerYear(sessionId: number): Observable<ResponseEntityApi<YearOfSessionResponse>> {
    let params = new HttpParams().set("sessionid", sessionId);

    return this.http.get<ResponseEntityApi<YearOfSessionResponse>>(environment.API_URL + '/session', {params});
  }

  public checkIfCanDeleteSession(sessionId: number): Observable<ResponseEntityApi<boolean>> {
    let params = new HttpParams().set("sessionid", sessionId);

    return this.http.get<ResponseEntityApi<boolean>>(environment.API_URL + '/session/check', {params});
  }

  deleletSession(id: number): Observable<ResponseEntityApi<void>> {
    let params = new HttpParams().set("sessionid", id);
    return this.http.delete<ResponseEntityApi<void>>(environment.API_URL + '/session', {params})
  }
}
