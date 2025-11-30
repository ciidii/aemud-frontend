import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {MemberDataResponse, RegistrationResponse, TypeInscription} from "../../../core/models/member-data.model";
import {map, Observable, of} from "rxjs";

import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {RegistrationModel, RegistrationStatus} from "../../../core/models/RegistrationModel";
import {MandateTimelineItem} from "../../../core/models/timeline.model";
import {PhaseStatus} from "../../../core/models/phaseStatus.enum";
import {SearchParams} from "../../../core/models/SearchParams";
import {ResponsePageableApi} from "../../../core/models/response-pageable-api";

@Injectable({
  providedIn: 'root'
})
export class MemberHttpService {
  httpClient = inject(HttpClient);
  private readonly _http = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/members`;

  searchMember(searchParams: SearchParams): Observable<ResponsePageableApi<MemberDataResponse[]>> {
    return this.httpClient.post<ResponsePageableApi<MemberDataResponse[]>>(`${environment.API_URL}/members/search`, searchParams);
  }

  addMember(member: any) {
    const options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }
    return this.httpClient.post<ResponseEntityApi<MemberDataResponse>>(environment.API_URL + `/members`, member, options);
  }

  getMemberById(id: string): Observable<ResponseEntityApi<MemberDataResponse>> {
    return this._http.get<ResponseEntityApi<MemberDataResponse>>(`${this._url}/${id}`).pipe(
      map(response => {
        if (response.data) {
          // Add new property with mock data
          response.data.registrationOverview = {
            latestRegistration: {
              id: 'reg2',
              member: id,
              phase: {
                id: 'p2024-1',
                nom: 'Phase 1',
                dateDebut: [2024,10,1],
                dateFin:[2024,10,1],
                status: PhaseStatus.TERMINATED,
                dateDebutInscription: [2024,10,1],
                dateFinInscription: [2024,10,1]
              },
              mandatName: 'Mandat 2024-2025',
              statusPayment: true,
              registrationType: TypeInscription.REINSCRIPTION,
              dateInscription: "", registrationStatus: RegistrationStatus.EXPIRED
            },
            nextRegistrablePhase: {
              id: 'p2024-1',
              nom: 'Phase 1',
              dateDebut: [2024,10,1],
              dateFin:[2024,10,1],
              status: PhaseStatus.TERMINATED,
              dateDebutInscription: [2024,10,1],
              dateFinInscription: [2024,10,1]
            }
          };
        }
        return response;
      })
    );
  }

  getMemberRegistrationTimeline(memberId: string): Observable<MandateTimelineItem[]> {
    // --- MOCK DATA ---
    const mockTimeline: MandateTimelineItem[] = [
      {
        mandat: {
          id: 'm2024',
          nom: 'Mandat 2024-2025',
          dateDebut: '2024-10-01',
          dateFin: '2025-07-31',
          estActif: false,
          phases: [] // Simplified for mock
        },
        phases: [
          {
            phase: {
              id: 'p2024-1',
              nom: 'Phase 1',
              dateDebut: [2024,10,1],
              dateFin:[2024,10,1],
              status: PhaseStatus.TERMINATED,
              dateDebutInscription: [2024,10,1],
              dateFinInscription: [2024,10,1]
            },
            registration: {
              id: 'reg1',
              member: memberId,
              phase: {
                id: 'p2024-1',
                nom: 'Phase 1',
                dateDebut: [2024,10,1],
                dateFin:[2024,10,1],
                status: PhaseStatus.TERMINATED,
                dateDebutInscription: [2024,10,1],
                dateFinInscription: [2024,10,1]
              },
              mandatName: 'Mandat 2024-2025',
              statusPayment: true,
              registrationType: TypeInscription.REINSCRIPTION,
              dateInscription: "",
              registrationStatus: RegistrationStatus.EXPIRED
            },
            isRegistrable: false,
            status: 'REGISTERED'
          },
          {
            phase: {
              id: 'p2024-1',
              nom: 'Phase 1',
              dateDebut: [2024,10,1],
              dateFin:[2024,10,1],
              status: PhaseStatus.TERMINATED,
              dateDebutInscription: [2024,10,1],
              dateFinInscription: [2024,10,1]
            },
            registration: {
              id: 'reg2',
              member: memberId,
              phase: {
                id: 'p2024-1',
                nom: 'Phase 1',
                dateDebut: [2024,10,1],
                dateFin:[2024,10,1],
                status: PhaseStatus.TERMINATED,
                dateDebutInscription: [2024,10,1],
                dateFinInscription: [2024,10,1]
              },
              mandatName: 'Mandat 2024-2025',
              statusPayment: true,
              registrationType: TypeInscription.REINSCRIPTION,
              dateInscription: "",
              registrationStatus: RegistrationStatus.EXPIRED
            },
            isRegistrable: false,
            status: 'REGISTERED'
          }
        ]
      },
      {
        mandat: {
          id: 'm2025',
          nom: 'Mandat 2025-2026',
          dateDebut: '2025-10-01',
          dateFin: '2026-07-31',
          estActif: true,
          phases: [] // Simplified for mock
        },
        phases: [
          {
            phase: {
              id: 'p2024-1',
              nom: 'Phase 1',
              dateDebut: [2024,10,1],
              dateFin:[2024,10,1],
              status: PhaseStatus.TERMINATED,
              dateDebutInscription: [2024,10,1],
              dateFinInscription: [2024,10,1]
            },
            registration: null,
            isRegistrable: true,
            status: 'MISSED_OPEN'
          },
          {
            phase: {
              id: 'p2024-1',
              nom: 'Phase 1',
              dateDebut: [2024,10,1],
              dateFin:[2024,10,1],
              status: PhaseStatus.TERMINATED,
              dateDebutInscription: [2024,10,1],
              dateFinInscription: [2024,10,1]
            },
            registration: null,
            isRegistrable: false,
            status: 'PENDING'
          }
        ]
      }
    ];
    return of(mockTimeline);
  }

  register(registrationData: any): Observable<RegistrationResponse> {
    return this._http.post<RegistrationResponse>(`${this._url}/register`, registrationData);
  }

  updateRegister(registrationData: RegistrationModel): Observable<ResponseEntityApi<RegistrationModel>> {
    return this._http.put<ResponseEntityApi<RegistrationModel>>(`${this._url}/register`, registrationData);
  }

  deleteMember(id: string): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }
}
