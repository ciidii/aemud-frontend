import {Component, inject, OnInit, signal} from '@angular/core';
import {YearOfSessionService} from "../../../core/services/year-of-session.service";
import {MemberService} from "../../core/member.service";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {forkJoin, of, switchMap} from "rxjs";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-list-contribution',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit {
  stats = signal({
    registeredMembers: 0,
    completedPayments: 0,
    pendingRegistrations: 0,
    newRegistrations: 0,
    renewalRegistrations: 0
  });

  sessionId: string = "";
  private sessionService = inject(YearOfSessionService);
  private memberService = inject(MemberService);

  currentYear$ = this.sessionService.getCurrentYear();
  years$ = this.sessionService.getYears();

  ngOnInit(): void {
    this.currentYear$.subscribe({
      next: currentYear => {
        this.loadStat(currentYear.data.id);
      }, error: error => {
      }
    })
  }

  reloadStat(sessionId: string) {
    this.loadStat(sessionId);
  }


  loadStat(sessionid: string) {
    this.sessionService.getPaticulerYear(sessionid).pipe(
      switchMap(current =>
        forkJoin({
          registeredMembers: this.memberService.getRegistrationBySession(current.data.id),
          completedPayments: this.memberService.getPayedOrNoPayedSessionCountPeerSession(current.data.id, true),
          pendingRegistrations: this.memberService.getPayedOrNoPayedSessionCountPeerSession(current.data.id, false),
          newRegistrations: this.memberService.getNewOrRenewalAdherentForASession(current.data.id, 'INITIAL'),
          renewalRegistrations: this.memberService.getNewOrRenewalAdherentForASession(current.data.id, 'REINSCRIPTION')
        }).pipe(
          catchError(error => {
            console.error('Erreur lors du chargement des statistiques:', error);
            return of(null); // on évite le crash du stream
          })
        )
      )
    ).subscribe(results => {
      if (results) {
        this.stats.set({
          registeredMembers: results.registeredMembers?.data ?? 0,
          completedPayments: results.completedPayments?.data ?? 0,
          pendingRegistrations: results.pendingRegistrations?.data ?? 0,
          newRegistrations: results.newRegistrations?.data ?? 0,
          renewalRegistrations: results.renewalRegistrations?.data ?? 0,
        });
        console.log('[Statistiques mises à jour]', this.stats());
      }
    });

  }

}
