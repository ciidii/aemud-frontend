import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {AppStateService} from "../../core/services/app-state.service";
import {MessageModel} from "../../core/models/message.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private appState: AppStateService) {
  }

  sendNotification(message: MessageModel) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.httpClient.post<any>(environment.API_URL + `/notifications/sms`, message, options);
  }
}
