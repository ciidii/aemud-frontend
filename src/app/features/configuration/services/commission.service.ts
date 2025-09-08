import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {CommissionModel} from "../../../core/models/commission.model";
import {environment} from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CommissionService {

  constructor(private http: HttpClient) {
  }

  public getCommissions(): Observable<ResponseEntityApi<Array<CommissionModel>>> {
    return this.http.get<ResponseEntityApi<Array<CommissionModel>>>(environment.API_URL + '/commissions/all')
  }

  addCommission(club: CommissionModel): Observable<ResponseEntityApi<CommissionModel>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.http.post<ResponseEntityApi<CommissionModel>>(environment.API_URL + `/commissions`, club, options);
  }

  deleteCommission(commissionID: number): Observable<ResponseEntityApi<void>> {
    let params = new HttpParams().set("commissionId", commissionID);
    return this.http.delete<ResponseEntityApi<void>>(environment.API_URL + "/commissions", {params})
  }

  getSingleCommission(commissionId: number): Observable<ResponseEntityApi<CommissionModel>> {
    let params = new HttpParams().set("commissionId", commissionId)
    return this.http.get<ResponseEntityApi<CommissionModel>>(environment.API_URL + "/commissions", {params})
  }
}
