import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../models/responseEntityApi";
import {Commission} from "../../models/Commission/Commission";
import {environment} from "../../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) {
  }

  public getClubs(): Observable<ResponseEntityApi<Array<Commission>>> {
    return this.http.get<ResponseEntityApi<Array<Commission>>>(environment.API_URL + '/clubs/all')
  }
}
