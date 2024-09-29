import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../models/responseEntityApi";
import {BourseModel} from "../../models/bourses/bourse.model";
import {environment} from "../../../../environments/environment.development";

@Injectable({
  providedIn: "root"
})
export class BourseService {
  constructor(private httpClient: HttpClient) {
  }

  getAllBourse(): Observable<ResponseEntityApi<Array<BourseModel>>> {
    return this.httpClient.get<ResponseEntityApi<Array<BourseModel>>>(environment.API_URL + "/bourses/all")
  }
}

