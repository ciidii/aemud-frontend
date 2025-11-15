import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Club} from '../../../core/models/member-data.model';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private readonly apiUrl = `${environment.API_URL}/clubs`;

  constructor(private http: HttpClient) {
  }

  getAllClubs(): Observable<Club[]> {
    return this.http.get<ResponseEntityApi<Club[]>>(`${this.apiUrl}/all`).pipe(
      map(response => response.data)
    );
  }
}

