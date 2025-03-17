import {Injectable} from '@angular/core';
import {MemberModel} from "../models/member.model";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  public memberState: any = {
    members: [] as MemberModel[],
    keyword: "",
    criteria: "",
    filters: {
      club: null,
      year: null,
      commission: null,
    },
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
