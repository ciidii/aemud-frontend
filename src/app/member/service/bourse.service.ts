import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../core/model/responseEntityApi";
import {BourseModel} from "../model/bourse.model";

@Injectable({
  providedIn:"root"
})
export class BourseService{
  url:string = `http://localhost:8080/aemud/api/v1/bourse/all`
  constructor(private httpClient:HttpClient) {
  }
  getAllBourse(): Observable<ResponseEntityApi<BourseModel[]>>{
    return this.httpClient.get<ResponseEntityApi<BourseModel[]>>(this.url)
  }
}

