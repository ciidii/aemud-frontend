import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {MessageTemplateModel} from "../../../core/models/message-template.model";


@Injectable({
  providedIn: 'root'
})
export class MessageTemplateService {
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
  getTemplates(): Observable<ResponseEntityApi<MessageTemplateModel[]>> {
    return this.http.get<ResponseEntityApi<MessageTemplateModel[]>>(`${this.apiUrl}/smsmodel/all`).pipe(
      tap(templates => console.log('Templates récupérés:', templates)),
      catchError(this.handleError)
    );
  }

  /**
   * Ajoute un nouveau template de message.
   */
  addTemplate(template: MessageTemplateModel): Observable<ResponseEntityApi<MessageTemplateModel>> {
    console.log(template);
    return this.http.post<ResponseEntityApi<MessageTemplateModel>>(`${this.apiUrl}/smsmodel`, template).pipe(
      tap(newTemplate => console.log('Template ajouté:', newTemplate)),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un template de message existant.
   */
  updateTemplate(template: MessageTemplateModel): Observable<ResponseEntityApi<MessageTemplateModel>> {
    let params = new HttpParams().set("id", template.id)
    return this.http.put<ResponseEntityApi<MessageTemplateModel>>(`${this.apiUrl}/smsmodel`, {params}).pipe(
      tap(updatedTemplate => console.log('Template mis à jour:', updatedTemplate)),
      catchError(this.handleError)
    );
  }

  /**
   * Supprime un template de message.
   */
  deleteTemplate(id: string): Observable<ResponseEntityApi<MessageTemplateModel>> {
    let params = new HttpParams().set("id", id)
    return this.http.delete<ResponseEntityApi<MessageTemplateModel>>(`${this.apiUrl}/smsmodel`, {params}).pipe(
      tap(() => console.log(`Template ${id} supprimé`)),
      catchError(this.handleError)
    );
  }
}
