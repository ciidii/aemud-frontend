import {AppStateService} from "../../core/services/app-state.service";
import {ResponseEntityApi} from "../../core/models/response-entity-api";
import {environment} from "../../../environments/environment.development";
import {MemberModel} from "../../core/models/member.model";
import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponsePageableApi} from "../../core/models/response-pageable-api";
import {RegistrationModel} from "../../core/models/RegistrationModel";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  url: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private appState: AppStateService) {
  }

  // --- EXISTING METHODS ---

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

  register(registrationRequest: any) { // Renamed parameter for clarity (was registrationRequestWithNumberPhone)
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.httpClient.post<any>(environment.API_URL + `/registration`, registrationRequest, options);
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

  // Your existing getMemberBySession (which returns Members)
  // This seems to be intended for "new-inscription-session" which might filter members that are newly inscribed.
  // We'll keep this as is, but our `getRegistrations` method will fetch the actual registration records.
  getMemberBySession(sessionId: string): Observable<ResponseEntityApi<Array<MemberModel>>> {
    let params = new HttpParams()
      .set("session", sessionId)
    return this.httpClient.get<ResponseEntityApi<Array<MemberModel>>>(environment.API_URL + `/registration/new-inscription-session`, {params});
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

  // --- NEW METHOD FOR FETCHING REGISTRATIONS ---

  /**
   * Fetches a list of registrations. Can be filtered by session ID.
   * Assumes the backend endpoint is `/registration` and can take a `session` query parameter.
   * @param sessionId Optional. The ID of the session to filter registrations by.
   * @returns An Observable of ResponseEntityApi containing an array of RegistrationModel.
   */
  public getRegistrations(sessionId?: string): Observable<ResponseEntityApi<Array<RegistrationModel>>> {
    let params = new HttpParams();
    if (sessionId) {
      params = params.set("session", sessionId);
    }
    // Adjust this endpoint `/registration` if your backend uses a different path for listing all registrations.
    return this.httpClient.get<ResponseEntityApi<Array<RegistrationModel>>>(`${environment.API_URL}/registration`, {params});
  }

  /**
   * Fetches all members. This is useful for the re-enrollment component's member list.
   * Assuming your backend has an endpoint for getting all members.
   * You mentioned `getMemberBySession` earlier; this `getMembers` is a general list.
   */
  public getMembers(): Observable<ResponseEntityApi<Array<MemberModel>>> {
    return this.httpClient.get<ResponseEntityApi<Array<MemberModel>>>(`${environment.API_URL}/members/all`); // Assuming /members/all or similar
  }

}
