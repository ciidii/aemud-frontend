import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AppStateService} from "../../../core/services/app-state.service";
import {SmsModel} from "../../../core/models/sms.model";
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private appState: AppStateService) {
  }

  sendNotification(message: SmsModel) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.httpClient.post<unknown>(environment.API_URL + `/notifications/sms`, message, options);
  }
}
