import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../models/response-entity-api";
import {environment} from "../../../environments/environment.development";
import {ClubModel} from "../models/club.model";

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) {
  }

  public getClubs(): Observable<ResponseEntityApi<Array<ClubModel>>> {
    return this.http.get<ResponseEntityApi<Array<ClubModel>>>(environment.API_URL + '/clubs/all')
  }

  addClubs(club: ClubModel): Observable<ResponseEntityApi<ClubModel>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.http.post<ResponseEntityApi<ClubModel>>(environment.API_URL + `/clubs`, club, options);
  }

  deleteClub(clubId: number): Observable<ResponseEntityApi<void>> {
    let params = new HttpParams
    ().set("clubId", clubId)
    return this.http.delete<ResponseEntityApi<void>>(environment.API_URL + "/clubs", {params})
  }

  getSingleClub(clubId: number): Observable<ResponseEntityApi<ClubModel>> {
    let params = new HttpParams().set("clubId", clubId);
    return this.http.get<ResponseEntityApi<ClubModel>>(environment.API_URL + "/clubs", {params})
  }
}
