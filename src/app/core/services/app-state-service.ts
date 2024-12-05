import {Injectable} from '@angular/core';
import {MemberData} from "../models/member/MemberData";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  public memberState: any = {
    members: [] as MemberData[],
    keyword: "",
    criteria: "name",
    totalPages: 0,
    pageSize: 10,
    currentPage: 1,
    status: "",
    errorMessage: ""
  }

  constructor() {
  }

  public setMemberState(state: any): void {
    this.memberState = {...this.memberState, ...state};
  }
}
