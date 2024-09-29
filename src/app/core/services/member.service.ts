import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {MemberModel} from "../../member/model/member.model";
import {ResponsePageableApi} from "../models/responsePageableApi";
import {RequestPageableVO} from "../models/requestPageableVO";
import {AppStateService} from "./app-state-service";
import {ResponseEntityApi} from "../models/responseEntityApi";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  url:string = `http://localhost:8080/aemud/api/v1`;
  constructor(private httpClient: HttpClient,private appState:AppStateService) {
  }

  public getAllMember(requestPageableVO: RequestPageableVO):Observable<ResponsePageableApi<Array<MemberModel>>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type","application/json"),
      params: new HttpParams().set("page",this.appState.memberState.currentPage).set("rpp",this.appState.memberState.pageSize)
    }
    return this.httpClient.get<ResponsePageableApi<Array<MemberModel>>>(`${this.url}`+"/members/all",options);
  }


  public deleteMember(member: MemberModel): Observable<any> {
    let options = {
      headers: new HttpHeaders().set("Content-Type","application/json"),
      params: new HttpParams().set("userId",member.id),
    }
    return this.httpClient.delete<Array<MemberModel>>(`${this.url}/members`,options);
  }

  addMember(member: any) {
    let options = {
      headers: new HttpHeaders().set("Content-Type","application/json"),
      params: new HttpParams().set("backup",false)
    }
    return this.httpClient.post<any>(`${this.url}/members`, member,options);
  }

  searchMember(keyword: string, criteria: string, pageSize: number, currentPage: number) {
    return this.httpClient.get<Array<MemberModel>>(`${this.url}/members?${criteria}_like=${keyword}&_page=${currentPage}&_limit=${pageSize}`, {observe: 'response'});
  }

  getMemberById(memberId: number):Observable<ResponseEntityApi<MemberModel>> {
    let options = {
      headers: new HttpHeaders().set("Content-Type","application/json"),
      params: new HttpParams().set("userId",memberId),
    }
    return this.httpClient.get<ResponseEntityApi<MemberModel>>(`${this.url}/members`,options);
  }

  updateMember(memberChange: MemberModel) {
    return this.httpClient.put<MemberModel>(`${this.url}/members`, memberChange);
  }
}
