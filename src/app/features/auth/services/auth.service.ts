import {inject, Injectable} from '@angular/core';
import {Observable, of,} from 'rxjs';
import { UserCredential } from "../../../core/models/user-credential.model";
import { SessionService } from "../../../core/services/session.service";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.API_URL;
  private accessToken: string='';
  private username: string='';
  private roles: string[] = [];
  private sessionService= inject(SessionService);
  private http= inject(HttpClient);

  login(credentials: UserCredential): Observable<ResponseEntityApi<any>> {
    return this.http.post<any>(`${this.apiUrl}/auth/authenticate`, {username: credentials.username, password: credentials.password});
  }
  getUserByUsername(username: string): Observable<ResponseEntityApi<any>> {
    return this.http.get<any>(`${this.apiUrl}/auth/authenticate`);
  }

  logout(): void {
    this.sessionService.clearSession();
  }

  validateResetCode(code: string): Observable<any> {
    // Fake a call to the backend to validate the code.
    // In a real app, this would be an HTTP call.
    if (code === '1234') {
      return of({ success: true });
    } else {
      return of({ success: false });
    }
  }


  resetPassword(newPassword: string): Observable<any> {
    // Fake a call to the backend to reset the password.
    // In a real app, this would be an HTTP call.
    console.log(`Password reset to: ${newPassword}`);
    return of({ success: true });
  }
  loadProfile(data: any) {
    this.accessToken = data["bearer"]
    let decodedJwt: any = jwtDecode(this.accessToken);
    this.username = decodedJwt.sub;
    this.roles = decodedJwt.roles.split(" ");
  }

}
