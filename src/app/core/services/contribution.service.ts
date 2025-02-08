import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppStateService} from "./app-state-service";
import {Observable} from "rxjs";
import {ContributionData} from "../models/ContributionData";
import {ResponseEntityApi} from "../models/responseEntityApi";

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  url: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private appState: AppStateService) {
  }

  public getContribute(phoneNumber: string, monthId: string, sessionId: string): Observable<ResponseEntityApi<ContributionData>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    let contributionData = {
      phoneNumber: phoneNumber,
      monthId: monthId,
      sessionId: sessionId
    }
    return this.httpClient.post<ResponseEntityApi<ContributionData>>(`${this.url}` + "/contribution/contribute-phone", contributionData, options);
  }
}
