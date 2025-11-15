import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Commission} from '../../../core/models/member-data.model';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';

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
}

