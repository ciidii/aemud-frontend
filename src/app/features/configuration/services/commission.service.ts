import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Commission} from '../../../core/models/member-data.model';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';

export interface CommissionDto {
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommissionService {
  private readonly apiUrl = `${environment.API_URL}/commissions`;

  constructor(private http: HttpClient) {
  }

  getAllCommissions(): Observable<Commission[]> {
    return this.http.get<ResponseEntityApi<Commission[]>>(`${this.apiUrl}/all`).pipe(
      map(response => response.data)
    );
  }

  createCommission(commission: CommissionDto): Observable<Commission> {
    return this.http.post<ResponseEntityApi<Commission>>(this.apiUrl, commission).pipe(
      map(response => response.data)
    );
  }

  updateCommission(commission: Commission): Observable<Commission> {
    return this.http.put<ResponseEntityApi<Commission>>(this.apiUrl, commission).pipe(
      map(response => response.data)
    );
  }

  deleteCommission(commissionId: string): Observable<void> {
    const params = new HttpParams().set('commissionId', commissionId);
    return this.http.delete<void>(this.apiUrl, {params});
  }
}

