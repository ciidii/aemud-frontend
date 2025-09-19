import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bourse } from '../../../core/models/member-data.model';
import { environment } from '../../../../environments/environment';
import { ResponseEntityApi } from '../../../core/models/response-entity-api';

@Injectable({
  providedIn: 'root'
})
export class BourseService {
  private readonly apiUrl = `${environment.API_URL}/bourses`;

  constructor(private http: HttpClient) { }

  getAllBourses(): Observable<Bourse[]> {
    return this.http.get<ResponseEntityApi<Bourse[]>>(`${this.apiUrl}/all`).pipe(
      map(response => response.data)
    );
  }
}
