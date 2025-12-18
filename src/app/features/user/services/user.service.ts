import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {ResponsePageableApi} from "../../../core/models/response-pageable-api";

export interface CreateUserRequest {
  memberId: string;
  roles: string[];
}

export interface UserSearchParams {
  page?: number;
  rpp?: number;
  keyword?: string;
  roles?: string[];
  locked?: boolean | null;
  forcePasswordChange?: boolean | null;
}

export interface UserResponseDto {
  id: string;
  username: string;
  roles: string[];
  locked: boolean;
  forcePasswordChange: boolean;
  memberId: string;
}

export interface CreateUserRequest {
  memberId: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  checkForgottenPasswordEmail(email: string): Observable<ResponseEntityApi<void>> {
    return this.http.post<ResponseEntityApi<void>>(`${this.apiUrl}/users/forgotten-password-email/${email}`, {});

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

  searchUsers(params: UserSearchParams): Observable<ResponsePageableApi<UserResponseDto[]>> {
    const httpParams: any = {};

    if (params.page) httpParams.page = params.page.toString();
    if (params.rpp) httpParams.rpp = params.rpp.toString();
    if (params.keyword) httpParams.keyword = params.keyword;
    if (params.roles && params.roles.length > 0) {
      httpParams.roles = params.roles.join(',');
    }
    if (params.locked !== null && params.locked !== undefined) {
      httpParams.locked = params.locked.toString();
    }
    if (params.forcePasswordChange !== null && params.forcePasswordChange !== undefined) {
      httpParams.forcePasswordChange = params.forcePasswordChange.toString();
    }

    return this.http.get<ResponsePageableApi<UserResponseDto[]>>(
      `${this.apiUrl}/users`,
      {params: httpParams}
    );
  }

  lockUser(userId: string): Observable<ResponseEntityApi<void>> {
    return this.http.patch<ResponseEntityApi<void>>(
      `${this.apiUrl}/users/${userId}/lock`,
      {}
    );
  }

  unlockUser(userId: string): Observable<ResponseEntityApi<void>> {
    return this.http.patch<ResponseEntityApi<void>>(
      `${this.apiUrl}/users/${userId}/unlock`,
      {}
    );
  }

  forcePasswordChange(userId: string, value: boolean): Observable<ResponseEntityApi<void>> {
    return this.http.patch<ResponseEntityApi<void>>(
      `${this.apiUrl}/users/${userId}/force-password-change`,
      null,
      {params: {value: value.toString()}}
    );
  }

  updateRoles(userId: string, roles: string[]): Observable<ResponseEntityApi<void>> {
    return this.http.patch<ResponseEntityApi<void>>(
      `${this.apiUrl}/users/${userId}/roles`,
      {roles}
    );
  }

  createUser(payload: CreateUserRequest): Observable<ResponseEntityApi<void>> {
    return this.http.post<ResponseEntityApi<void>>(
      `${this.apiUrl}/users`,
      payload,
    );
  }

  getUserById(id: string): Observable<ResponseEntityApi<UserResponseDto>> {
    return this.http.get<ResponseEntityApi<UserResponseDto>>(`${this.apiUrl}/users/${id}`);
  }

  changePassword(userId: string, password: string): Observable<ResponseEntityApi<void>> {
    return this.http.patch<ResponseEntityApi<void>>(
      `${this.apiUrl}/users/${userId}/change-password`,
      {password}
    );
  }
}
