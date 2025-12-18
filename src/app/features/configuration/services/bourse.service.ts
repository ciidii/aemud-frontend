import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';
import {BourseModel} from "../../../core/models/bourse.model";

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
}
