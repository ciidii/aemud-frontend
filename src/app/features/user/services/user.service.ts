import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  checkForgottenPasswordEmail(email: string): Observable<ResponseEntityApi<void>> {
    return this.http.post<ResponseEntityApi<void>>(
      `${this.apiUrl}/users/forgotten-password-email`,
      {email: email},
    );

  }

  checkForgottenPasswordToken(email: string, token: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/users/check-valide-token`,
      {email: email, token: token},
    );

  }

  resetForgottenPassword(password: string, confirmPassword: string, username: string, token: string): Observable<ResponseEntityApi<void>> {
    return this.http.post<ResponseEntityApi<void>>(
      `${this.apiUrl}/users/change-password-forgotten`, {
        password: password,
        confirmPassword: confirmPassword,
        username: username,
        token: token
      }
    )
  }
}
