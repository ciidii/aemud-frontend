import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../core/model/responseEntityApi";
import {ClubModel} from "../model/club.model";

@Injectable({
  providedIn: "root"
})
export class ClubService {
  url:string = `http://localhost:8080/aemud/api/v1/clubs/all`
  constructor(private httpClient: HttpClient) {
  }
  public getAllClubs():Observable<ResponseEntityApi<ClubModel[]>>{
    return this.httpClient.get<ResponseEntityApi<ClubModel[]>>(this.url);
}
}
