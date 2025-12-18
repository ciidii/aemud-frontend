import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppStateService} from "../../../core/services/app-state.service";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {ContributionModel} from "../../../core/models/contribution.model";
import {ContributionData} from "../../../core/models/contribution-data.model";

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  url: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private appState: AppStateService) {
  }

  public getContribute(phoneNumber: string, monthId: string, sessionId: string): Observable<ResponseEntityApi<ContributionModel>> {
    const options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    const contributionData = {
      phoneNumber: phoneNumber,
      monthId: monthId,
      sessionId: sessionId
    }
    return this.httpClient.post<ResponseEntityApi<ContributionModel>>(`${this.url}` + "/contribution/contribute-phone", contributionData, options);
  }

  public getContributionsByMemberAndSession(memberId: string, sessionId: string): Observable<ResponseEntityApi<ContributionModel[]>> {
    const params = new HttpParams()
      .set('phaseId', sessionId)
      .set('memberId', memberId);
    return this.httpClient.get<ResponseEntityApi<ContributionModel[]>>(`${this.url}/contribution/member-contributions`, {params});
  }

  public getContributionCalendar(memberId: string, phaseId: string): Observable<ResponseEntityApi<ContributionData>> {
    const params = new HttpParams()
      .set('phaseId', phaseId)
      .set('memberId', memberId);
    return this.httpClient.get<ResponseEntityApi<ContributionData>>(`${this.url}/contribution/member-contribution-calendar`, {params});
  }

  public recordPayment(paymentData: { contributionsID: string[]; payementMethode: string; }): Observable<any> {
    return this.httpClient.post(`${this.url}/contribution/pay-contributions`, paymentData);
  }
}
