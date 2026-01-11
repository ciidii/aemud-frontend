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

export interface SmsModelDTO {
  id: string;
  modelName: string;
  smsModel: string;
}

export interface CampaignRequestDto {
  campaignName: string;
  recipientGroupId: string;
  messageTemplateId?: string | null;
  customMessage?: string | null;
}

export interface SmsCampaignDto {
  id: string;
  campaignName: string;
  smsModelId: string | null;
  recipientGroupId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  startedAt: string; // ISO Date string
  completedAt: string | null;
  totalMessages: number;
  successfulMessages: number;
  failedMessages: number;
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

  getSmsTemplates(): Observable<SmsModelDTO[]> {
    return this.http.get<ResponseEntityApi<SmsModelDTO[]>>(`${this.apiUrl}/smsmodel/all`)
      .pipe(
        map(response => response.data)
      );
  }

  createCampaign(payload: CampaignRequestDto): Observable<ResponseEntityApi<SmsCampaignDto>> {
    return this.http.post<ResponseEntityApi<SmsCampaignDto>>(`${this.apiUrl}/sms-campaigns`, payload);
  }
}
