import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Commission} from "../../models/Commission/Commission";
import {ResponseEntityApi} from "../../models/responseEntityApi";
import {environment} from "../../../../environments/environment.development";
import {CommissionModel} from "../../../member/model/commission.model";

@Injectable({
  providedIn: 'root'
})
export class CommissionService {

  constructor(private http: HttpClient) {
  }

  public getCommissions(): Observable<ResponseEntityApi<Array<Commission>>> {
    return this.http.get<ResponseEntityApi<Array<Commission>>>(environment.API_URL + '/commissions/all')
  }

  addCommission(club: CommissionModel): Observable<ResponseEntityApi<CommissionModel>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.http.post<ResponseEntityApi<CommissionModel>>(environment.API_URL + `/commissions`, club, options);
  }
}
