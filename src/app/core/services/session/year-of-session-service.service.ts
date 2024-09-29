import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
}
