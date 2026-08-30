import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';

export interface SystemSettingModel {
  id?: string;
  key: string;
  value: string;
  description: string;
  lastModifiedDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {
  private readonly apiUrl = `${environment.API_URL}/settings`;

  constructor(private http: HttpClient) {}

  getAllSettings(): Observable<SystemSettingModel[]> {
    return this.http.get<ResponseEntityApi<SystemSettingModel[]>>(this.apiUrl).pipe(
      map(res => res.data || [])
    );
  }

  getSetting(key: string): Observable<SystemSettingModel> {
    return this.http.get<ResponseEntityApi<SystemSettingModel>>(`${this.apiUrl}/${key}`).pipe(
      map(res => res.data)
    );
  }

  updateSetting(key: string, value: string, description?: string): Observable<SystemSettingModel> {
    return this.http.put<ResponseEntityApi<SystemSettingModel>>(`${this.apiUrl}/${key}`, {
      value,
      description
    }).pipe(
      map(res => res.data)
    );
  }

  updateAllSettings(settings: SystemSettingModel[]): Observable<SystemSettingModel[]> {
    return this.http.put<ResponseEntityApi<SystemSettingModel[]>>(this.apiUrl, settings).pipe(
      map(res => res.data || [])
    );
  }
}
