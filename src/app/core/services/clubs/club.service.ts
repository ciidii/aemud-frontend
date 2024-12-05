import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../models/responseEntityApi";
import {Commission} from "../../models/Commission/Commission";
import {environment} from "../../../../environments/environment.development";
import {ClubModel} from "../../../member/model/club.model";
import {BourseModel} from "../../models/bourses/bourse.model";

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) {
  }

  public getClubs(): Observable<ResponseEntityApi<Array<Commission>>> {
    return this.http.get<ResponseEntityApi<Array<Commission>>>(environment.API_URL + '/clubs/all')
  }

  addClubs(club:ClubModel):Observable<ResponseEntityApi<ClubModel>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.http.post<ResponseEntityApi<ClubModel>>(environment.API_URL + `/clubs`, club, options);
  }
}
