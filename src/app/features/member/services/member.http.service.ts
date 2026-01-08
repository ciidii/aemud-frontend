import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {MemberDataResponse, RegistrationResponse} from "../../../core/models/member-data.model";
import {map, Observable} from "rxjs";

import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {RegistrationModel} from "../../../core/models/RegistrationModel";
import {MandateTimelineItem} from "../../../core/models/timeline.model";
import {SearchParams} from "../../../core/models/SearchParams";
import {ResponsePageableApi} from "../../../core/models/response-pageable-api";
import {MemberExportRequestDto} from "../../../core/models/member-export-request.model";

@Injectable({
  providedIn: 'root'
})
export class MemberHttpService {
  httpClient = inject(HttpClient);
  private readonly _http = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/members`;

  searchMember(searchParams: SearchParams): Observable<ResponsePageableApi<MemberDataResponse[]>> {
    return this.httpClient.post<ResponsePageableApi<MemberDataResponse[]>>(`${environment.API_URL}/members/search`, searchParams);
  }

  exportMembers(request: MemberExportRequestDto): Observable<HttpResponse<Blob>> {
    return this._http.post(`${this._url}/export`, request, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  addMember(member: any) {
    const options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    };
    return this.httpClient.post<ResponseEntityApi<MemberDataResponse>>(environment.API_URL + `/members`, member, options);
  }

  getMemberById(id: string): Observable<ResponseEntityApi<MemberDataResponse>> {
    return this._http.get<ResponseEntityApi<MemberDataResponse>>(`${this._url}/${id}`);
  }

  getMemberRegistrationTimeline(memberId: string): Observable<MandateTimelineItem[]> {
    return this._http
      .get<ResponseEntityApi<MandateTimelineItem[]>>(`${environment.API_URL}/registration/member/${memberId}/history`)
      .pipe(map(response => response.data));
  }

  register(registrationData: any): Observable<RegistrationResponse> {
    return this._http.post<RegistrationResponse>(`${environment.API_URL}/registration`, registrationData);
  }

  updateRegister(registrationData: RegistrationModel): Observable<ResponseEntityApi<RegistrationModel>> {
    return this._http.put<ResponseEntityApi<RegistrationModel>>(`${this._url}/register`, registrationData);
  }

  deleteMember(id: string): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }
}
