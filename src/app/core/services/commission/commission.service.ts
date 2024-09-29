import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Commission} from "../../models/Commission/Commission";
import {ResponseEntityApi} from "../../models/responseEntityApi";
import {environment} from "../../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CommissionService {

  constructor(private http: HttpClient) {
  }

  public getCommissions(): Observable<ResponseEntityApi<Array<Commission>>> {
    return this.http.get<ResponseEntityApi<Array<Commission>>>(environment.API_URL + '/commissions/all')
  }
}
