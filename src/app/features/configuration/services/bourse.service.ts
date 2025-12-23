import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';
import {BourseModel} from "../../../core/models/bourse.model";

export interface BourseDto {
  type: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BourseService {
  private readonly apiUrl = `${environment.API_URL}/bourses`;

  constructor(private http: HttpClient) {
  }

  getAllBourses(): Observable<BourseModel[]> {
    return this.http.get<ResponseEntityApi<BourseModel[]>>(`${this.apiUrl}/all`).pipe(
      map(response => response.data)
    );
  }

  createBourse(bourse: BourseModel): Observable<BourseModel> {
    return this.http.post<ResponseEntityApi<BourseModel>>(this.apiUrl, bourse).pipe(
      map(response => response.data)
    );
  }

  updateBourse(bourse: BourseModel): Observable<BourseModel> {
    return this.http.put<ResponseEntityApi<BourseModel>>(this.apiUrl, bourse).pipe(
      map(response => response.data)
    );
  }

  deleteBourse(bourseId: string): Observable<void> {
    const params = new HttpParams().set('bourseId', bourseId);
    return this.http.delete<void>(this.apiUrl, {params});
  }
}
