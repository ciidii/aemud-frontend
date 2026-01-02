import {inject, Injectable} from '@angular/core';
import {catchError, finalize, map, Observable, of, tap} from 'rxjs';
import {UserCredential} from "../../../core/models/user-credential.model";
import {SessionService} from "../../../core/services/session.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {Router} from "@angular/router";
import {Role, UserModel} from "../../../core/models/user.model";
import {ChangePasswordRequest} from "../../../core/models/ChangePasswordRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

  private apiUrl = environment.API_URL;

  private sessionService = inject(SessionService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private currentUser: UserModel | null = null;

  constructor() {
    // Re-hydrate user state on application load
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  get currentUserValue(): UserModel | null {
    return this.currentUser;
  }

  login(credentials: UserCredential): Observable<ResponseEntityApi<any>> {
    // This call only sets the HttpOnly cookie. User data must be fetched separately.
    return this.http.post<ResponseEntityApi<any>>(`${this.apiUrl}/auth/authenticate`, {
      username: credentials.username,
      password: credentials.password
    });
  }

  getMe(): Observable<UserModel> {
    return this.http.get<ResponseEntityApi<UserModel>>(`${this.apiUrl}/users/me`).pipe(
      tap(response => {
        const user = response.data;
        this.sessionService.create(user);
        this.currentUser = user;
      }),
      map(response => response.data) // Return only the user object to the subscriber
    );
  }

  logout(): Observable<any> {
    // Call the dedicated logout endpoint to clear the HttpOnly cookie.
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      catchError(error => {
        // Even if the backend logout fails, we proceed to clear the client session.
        console.error("Backend logout failed, continuing with client-side cleanup.", error);
        return of(null); // Continue the stream so finalize is called.
      }),
      finalize(() => {
        // This block is guaranteed to run, breaking the redirect loop.
        this.currentUser = null;
        this.sessionService.clearSession();
      })
    );
  }

  firstConnectionPasswordChange(credentials: ChangePasswordRequest): Observable<ResponseEntityApi<any>> {
    return this.http.post<any>(`${this.apiUrl}/users/change-password-first-connection`, credentials);
  }

  getUserByUsername(username: string): Observable<ResponseEntityApi<UserModel>> {
    const params = new HttpParams().set('username', username);
    return this.http.get<ResponseEntityApi<UserModel>>(`${this.apiUrl}/users/user-by-username`, {params});
  }

  changePassword(password: string, confirmPassword: string): Observable<ResponseEntityApi<void>> {
    const passwordChange: ChangePasswordRequest = {
      password: password,
      confirmPassword: confirmPassword,
      username: this.currentUser?.username || ''
    };
    return this.firstConnectionPasswordChange(passwordChange);
  }

  signup(credentials: any): Observable<ResponseEntityApi<any>> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, credentials);
  }

  hasRole(requiredRoles: Role[]): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.roles.some(role =>
      requiredRoles.includes(role)
    );
  }

  hasMultipleRoles(requiredRoles: Role[]): boolean {
    if (!this.currentUser) return false;

    return requiredRoles.every(role =>
      this.currentUser!.roles.includes(role)
    );
  }
}

