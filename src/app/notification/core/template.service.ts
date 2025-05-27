import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {MessageTemplate} from "../../core/models/message.template";
import {environment} from "../../../environments/environment";
import {ResponseEntityApi} from "../../core/models/response-entity-api";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = environment.API_URL

  constructor(private http: HttpClient) {
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue !';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Récupère tous les templates de message.
   */
  getTemplates(): Observable<ResponseEntityApi<MessageTemplate[]>> {
    return this.http.get<ResponseEntityApi<MessageTemplate[]>>(`${this.apiUrl}/smsmodel/all`).pipe(
      tap(templates => console.log('Templates récupérés:', templates)),
      catchError(this.handleError)
    );
  }

  /**
   * Ajoute un nouveau template de message.
   */
  addTemplate(template: MessageTemplate): Observable<ResponseEntityApi<MessageTemplate>> {
    console.log(template);
    return this.http.post<ResponseEntityApi<MessageTemplate>>(`${this.apiUrl}/smsmodel`, template).pipe(
      tap(newTemplate => console.log('Template ajouté:', newTemplate)),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un template de message existant.
   */
  updateTemplate(template: MessageTemplate): Observable<ResponseEntityApi<MessageTemplate>> {
    let params = new HttpParams().set("id", template.id)
    return this.http.put<ResponseEntityApi<MessageTemplate>>(`${this.apiUrl}/smsmodel`, {params}).pipe(
      tap(updatedTemplate => console.log('Template mis à jour:', updatedTemplate)),
      catchError(this.handleError)
    );
  }

  /**
   * Supprime un template de message.
   */
  deleteTemplate(id: string): Observable<ResponseEntityApi<MessageTemplate>> {
    let params = new HttpParams().set("id", id)
    return this.http.delete<ResponseEntityApi<MessageTemplate>>(`${this.apiUrl}/smsmodel`, {params}).pipe(
      tap(() => console.log(`Template ${id} supprimé`)),
      catchError(this.handleError)
    );
  }
}
