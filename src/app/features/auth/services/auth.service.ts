import {inject, Injectable} from '@angular/core';
import {Observable,} from 'rxjs';
import {UserCredential} from "../../../core/models/user-credential.model";
import {SessionService} from "../../../core/services/session.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {jwtDecode} from "jwt-decode";
import {Router} from "@angular/router";
import {Role, UserModel} from "../../../core/models/user.model";
import {ChangePasswordRequest} from "../../../core/models/ChangePasswordRequest";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.API_URL;

  private username = '';
  private sessionService = inject(SessionService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwt_token = "";
  private currentUser: UserModel | null = null;

  constructor() {
    const token = localStorage.getItem('aemud_auth_token');
    if (token) {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUser = JSON.parse(user);
      }
    }
  }

  login(credentials: UserCredential): Observable<ResponseEntityApi<any>> {
    return this.http.post<any>(`${this.apiUrl}/auth/authenticate`, {
      username: credentials.username,
      password: credentials.password
    }).pipe(
      tap(response => {
        this.sessionService.startSession(response.data.jwt);
        this.fetchJwt(response.data.jwt);
      })
    );
  }

  firstConnectionPasswordChange(credentials: ChangePasswordRequest): Observable<ResponseEntityApi<any>> {
    return this.http.post<any>(`${this.apiUrl}/users/change-password-first-connection`, {
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
      username: credentials.username
    });
  }

  getUserByUsername(username: string): Observable<ResponseEntityApi<UserModel>> {
    const params = new HttpParams().set('username', username);
    return this.http.get<ResponseEntityApi<UserModel>>(`${this.apiUrl}/users/user-by-username`, {params});
  }

  changePassword(password: string, confirmPassword: string): Observable<ResponseEntityApi<void>> {
    const passwordChange: ChangePasswordRequest = {
      password: password,
      confirmPassword: confirmPassword,
      username: this.username
    };
    return this.firstConnectionPasswordChange(passwordChange).pipe(
      tap(result => {
        if (result.result === "Succeeded") {
          this.sessionService.startSession(this.jwt_token);
        }
      })
    );
  }

  logout(): void {
    this.sessionService.clearSession();
  }


  fetchJwt(jwt: string) {
    this.jwt_token = jwt;
    const decodedJwt: any = jwtDecode(jwt);
    this.username = decodedJwt.sub;

    this.getUserByUsername(decodedJwt.sub).subscribe({
      next: resApi => {
        if (resApi.status === "OK") {
          const rawUser = resApi.data;
          const mappedRoles: Role[] = rawUser.roles.map((roleName: any) => roleName as Role);
          const user: UserModel = {
            id: rawUser.id,
            username: rawUser.username,
            locked: rawUser.locked,
            forcePasswordChange: rawUser.forcePasswordChange,
            memberId: rawUser.memberId,
            roles: mappedRoles
          };
          this.currentUser = user;
          localStorage.setItem('user', JSON.stringify(user));
          this.redirectToTheRightPage(user);
        }
      }
    });
  }


  signup(credentials: any): Observable<ResponseEntityApi<any>> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, credentials);
  }

  redirectToTheRightPage(userFromApi: UserModel): void {
    if (userFromApi.forcePasswordChange) {
      console.log("La redirection ne fonction pas")
      this.router.navigateByUrl('auth/first-connection-password');
    } else if (userFromApi.locked) {
      this.router.navigateByUrl('auth/login');
    } else if (!userFromApi.forcePasswordChange && !userFromApi.locked) {
      this.sessionService.startSession(this.jwt_token);
      console.log("la redirection ne fonction pas")
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
