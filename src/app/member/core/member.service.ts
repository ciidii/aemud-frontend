import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponsePageableApi} from "../../core/models/response-pageable-api";
import {AppStateService} from "../../core/services/app-state.service";
import {ResponseEntityApi} from "../../core/models/response-entity-api";
import {environment} from "../../../environments/environment.development";
import {MemberModel} from "../../core/models/member.model";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  url: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private appState: AppStateService) {
  }


  public deleteMember(memberId: string | null): Observable<any> {
    // @ts-ignore
    let params = new HttpParams().set("memberId", memberId)
    return this.httpClient.delete<Array<MemberModel>>(`${this.url}/members`, {params});
  }

  addMember(member: any) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.httpClient.post<any>(environment.API_URL + `/members`, member, options);
  }

  register(registrationRequestWithNumberPhone: any) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.httpClient.post<any>(environment.API_URL + `/registration/number-phone`, registrationRequestWithNumberPhone, options);
  }

  getRegistrationBySession(sessionId: string) {
    let params = new HttpParams()
      .set("session", sessionId)
    return this.httpClient.get<ResponseEntityApi<number>>(environment.API_URL + `/registration/registration-peer-session`, {params});
  }

  getPayedOrNoPayedSessionCountPeerSession(sessionId: string, statusPayment: boolean) {
    let params = new HttpParams()
      .set("session", sessionId)
      .set("statusPayment", statusPayment)
    return this.httpClient.get<ResponseEntityApi<number>>(environment.API_URL + `/registration/payed-or-no-payed`, {params});
  }

  getNewOrRenewalAdherentForASession(sessionId: string, registrationType: string) {
    let params = new HttpParams()
      .set("session", sessionId)
      .set("typeInscription", registrationType)
    return this.httpClient.get<ResponseEntityApi<number>>(environment.API_URL + `/registration/new-inscription-session`, {params});
  }

  searchMember(keyword: string, criteria: string, filters: any): Observable<ResponsePageableApi<Array<MemberModel>>> {
    let params = new HttpParams()
      .set("criteria", criteria)
      .set("value", keyword)
      .set("page", this.appState.memberState.currentPage)
      .set("rpp", this.appState.memberState.pageSize)
      .set("club", filters?.club ? filters?.club : "")
      .set("commission", filters?.commission ? filters?.commission : "")
      .set("sessionIdForRegistration", filters?.year ? filters?.year : "");

    return this.httpClient.get<ResponsePageableApi<Array<MemberModel>>>(`${environment.API_URL}/members/search`, {params});
  }

  searchMemberToPrint(keyword: string, criteria: string, filters: any): Observable<ResponseEntityApi<Array<MemberModel>>> {
    let params = new HttpParams()
      .set("criteria", criteria)
      .set("value", keyword)
      .set("club", filters?.club ? filters?.club : "")
      .set("commission", filters?.commission ? filters?.commission : "")
      .set("year", filters?.year ? filters?.year : "");

    return this.httpClient.get<ResponseEntityApi<Array<MemberModel>>>(`${environment.API_URL}/members/print`, {params});
  }

  getMemberById(memberId: string | null): Observable<ResponseEntityApi<MemberModel>> {

    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      // @ts-ignore
      params: new HttpParams().set("member-id", memberId),
    }
    return this.httpClient.get<ResponseEntityApi<MemberModel>>(`${this.url}/members`, options);
  }

  updateMember(memberChange: MemberModel): Observable<MemberModel> {
    return this.httpClient.put<MemberModel>(`${this.url}/members`, memberChange);
  }


}
