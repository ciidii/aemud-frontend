import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Member} from "../../member/model/member.model";
import {ResponsePageableApi} from "../models/responsePageableApi";
import {RequestPageableVO} from "../models/requestPageableVO";
import {AppStateService} from "./app-state-service";
import {ResponseEntityApi} from "../models/responseEntityApi";
import {environment} from "../../../environments/environment.development";
import {MemberData} from "../models/member/MemberData";
import {Profile} from "../profile.model";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  url: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private appState: AppStateService) {
  }

  public getAllMember(requestPageableVO: RequestPageableVO): Observable<ResponsePageableApi<Array<MemberData>>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      params: new HttpParams().set("page", this.appState.memberState.currentPage).set("rpp", this.appState.memberState.pageSize)
    }
    return this.httpClient.get<ResponsePageableApi<Array<MemberData>>>(`${this.url}` + "/members/all", options);
  }


  public deleteMember(memberId: string | null): Observable<any> {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    }
    // @ts-ignore
    let params = new HttpParams().set("memberId", memberId)
    return this.httpClient.delete<Array<Member>>(`${this.url}/members`, {params});
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
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
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

  searchMember(keyword: string, criteria: string, filters: any): Observable<ResponsePageableApi<Array<Member>>> {
    let params = new HttpParams()
      .set("criteria", criteria)
      .set("value", keyword)
      .set("page", this.appState.memberState.currentPage)
      .set("rpp", this.appState.memberState.pageSize)
      .set("club", filters?.club ? filters?.club : "")
      .set("commission", filters?.commission ? filters?.commission : "")
      .set("sessionIdForRegistration", filters?.year ? filters?.year : "");

    return this.httpClient.get<ResponsePageableApi<Array<Member>>>(`${environment.API_URL}/members/search`, {params});
  }

  searchMemberToPrint(keyword: string, criteria: string, filters: any): Observable<ResponseEntityApi<Array<Profile>>> {
    let params = new HttpParams()
      .set("criteria", criteria)
      .set("value", keyword)
      .set("club", filters?.club ? filters?.club : "")
      .set("commission", filters?.commission ? filters?.commission : "")
      .set("year", filters?.year ? filters?.year : "");

    return this.httpClient.get<ResponseEntityApi<Array<Profile>>>(`${environment.API_URL}/members/print`, {params});
  }

  getMemberById(memberId: string | null): Observable<ResponseEntityApi<Profile>> {

    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      // @ts-ignore
      params: new HttpParams().set("member-id", memberId),
    }
    return this.httpClient.get<ResponseEntityApi<Profile>>(`${this.url}/members`, options);
  }

  updateMember(memberChange: Profile): Observable<Profile> {
    return this.httpClient.put<Profile>(`${this.url}/members`, memberChange);
  }


}
