import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Club} from '../../../core/models/member-data.model';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';

export interface ClubDto {
  name: string;
  description?: string;
}

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

  createClub(club: ClubDto): Observable<Club> {
    return this.http.post<ResponseEntityApi<Club>>(this.apiUrl, club).pipe(
      map(response => response.data)
    );
  }

  updateClub(club: Club): Observable<Club> {
    return this.http.put<ResponseEntityApi<Club>>(this.apiUrl, club).pipe(
      map(response => response.data)
    );
  }

  deleteClub(clubId: string): Observable<void> {
    const params = new HttpParams().set('clubId', clubId);
    return this.http.delete<void>(this.apiUrl, {params});
  }
}

