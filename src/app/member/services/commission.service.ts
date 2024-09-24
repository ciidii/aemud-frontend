import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../core/model/responseEntityApi";
import {CommissionModel} from "../model/commission.model";

@Injectable({
  providedIn:"root"
})
export class CommissionService{
  url:string = `http://localhost:8080/aemud/api/v1/commissions/all`
  constructor(private httpClient: HttpClient) {
  }
  getAllCommission():Observable<ResponseEntityApi<CommissionModel[]>>{
    return this.httpClient.get<ResponseEntityApi<CommissionModel[]>>(this.url)
  }
}
