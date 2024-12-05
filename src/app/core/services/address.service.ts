import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment.development";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppStateService} from "./app-state-service";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../models/responseEntityApi";
import {AddressInfo} from "../models/member/AddressInfo";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  url: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private appState: AppStateService) {
  }

  public getMemberCurrentSessionAddress(memberID: number): Observable<ResponseEntityApi<AddressInfo>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      params: new HttpParams().set("memberID", memberID)
    }
    return this.httpClient.get<ResponseEntityApi<AddressInfo>>(`${this.url}` + "/address-infos", options);
  }
}
