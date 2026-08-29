import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {FormSchema} from '../models/form-schema.model';
import {ResponseEntityApi} from '../models/response-entity-api';

@Injectable({
  providedIn: 'root'
})
export class FormSchemaService {
  private readonly apiUrl = `${environment.API_URL}/settings/form-schema`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère le schéma actif de formulaire d'inscription / recensement.
   */
  getFormSchema(): Observable<FormSchema> {
    return this.http.get<ResponseEntityApi<FormSchema>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  /**
   * Met à jour la configuration des groupes et champs de formulaire.
   */
  updateFormSchema(schema: FormSchema): Observable<FormSchema> {
    return this.http.put<ResponseEntityApi<FormSchema>>(this.apiUrl, schema).pipe(
      map(response => response.data)
    );
  }

  /**
   * Réinitialise le schéma de formulaire aux valeurs d'usine officielles.
   */
  resetFormSchema(): Observable<FormSchema> {
    return this.http.post<ResponseEntityApi<FormSchema>>(`${this.apiUrl}/reset`, {}).pipe(
      map(response => response.data)
    );
  }
}
