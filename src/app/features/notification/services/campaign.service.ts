import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ResponseEntityApi } from '../../../core/models/response-entity-api';

export interface RecipientGroupDto {
  id: string;
  groupKey: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  getRecipientGroups(): Observable<RecipientGroupDto[]> {
    return this.http.get<ResponseEntityApi<RecipientGroupDto[]>>(`${this.apiUrl}/recipient-groups`)
      .pipe(
        map(response => response.data)
      );
  }
}
