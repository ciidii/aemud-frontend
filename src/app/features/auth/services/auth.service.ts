import {inject, Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
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
export class AuthService {

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

  login(credentials: UserCredential): Observable<ResponseEntityApi<UserModel>> {
    return this.http.post<ResponseEntityApi<UserModel>>(`${this.apiUrl}/auth/authenticate`, {
      username: credentials.username,
      password: credentials.password
    }).pipe(
      tap(response => {
        // The backend now sets an HttpOnly cookie.
        // We receive the user object in the response.
        const user = response.data;
        this.sessionService.create(user);
        this.currentUser = user;
        this.redirectToTheRightPage(user);
      })
    );
  }

  logout(): Observable<any> {
    // Call the dedicated logout endpoint to clear the HttpOnly cookie
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        // Clear session state on the client-side
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

  redirectToTheRightPage(userFromApi: UserModel): void {
    if (userFromApi.forcePasswordChange) {
      this.router.navigateByUrl('auth/first-connection-password');
    } else if (userFromApi.locked) {
      // Should not happen if login is successful, but as a safeguard
      this.router.navigateByUrl('auth/login');
    } else {
      this.router.navigateByUrl('members/list-members');
    }
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

