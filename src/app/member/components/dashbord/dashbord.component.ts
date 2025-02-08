import {Component, OnInit} from '@angular/core';
import {YearOfSessionServiceService} from "../../../core/services/session/year-of-session-service.service";
import {MemberService} from "../../../core/services/member.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit {
  stats = {
    registeredMembers: 0,
    completedPayments: 0,
    pendingRegistrations: 0,
    newRegistrations: 0,
    renewalRegistrations:0,
  };

  years: any[] = [];
  sessionId!: string;

  constructor(
    private sessionService: YearOfSessionServiceService,
    private memberService: MemberService
  ) {
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions() {
    this.sessionService.getYears().subscribe({
      next: resp => {
        if (resp.status === "OK") {
          this.years = resp.data;
          const currentYear = this.years.find(year => year.currentYear);
          if (currentYear) {
            this.sessionId = currentYear.id;
            this.reloadStat();
          }
        }
      },
      error: () => {
        console.error("Erreur lors de la récupération des années.");
      }
    });
  }

  reloadStat() {
    if (this.sessionId) {
      this.getCurrentSessionStat();
      this.getCompletedPayments();
      this.getPendingRegistrations();
      this.getNewRegistrations();
      this.getRenewalRegistrations();
    }
  }



  getCurrentSessionStat() {
    this.memberService.getRegistrationBySession(this.sessionId).subscribe({
      next: resp => {
        if (resp.status === "OK") {
          this.stats.registeredMembers = resp.data;
        }
      },
      error: () => {
        console.error("Erreur lors de la récupération des inscriptions.");
      }
    });
  }

  getCompletedPayments() {
    this.memberService.getPayedOrNoPayedSessionCountPeerSession(this.sessionId, true).subscribe({
      next: resp => {
        if (resp.status === "OK") {
          this.stats.completedPayments = resp.data;
        }
      },
      error: () => {
        console.error("Erreur lors de la récupération des paiements.");
      }
    });
  }

  getPendingRegistrations() {
    this.memberService.getPayedOrNoPayedSessionCountPeerSession(this.sessionId, false).subscribe({
      next: resp => {
        if (resp.status === "OK") {
          this.stats.pendingRegistrations = resp.data;
        }
      },
      error: () => {
        console.error("Erreur lors de la récupération des inscriptions en attente.");
      }
    });
  }

  getNewRegistrations() {
    this.memberService.getNewOrRenewalAdherentForASession(this.sessionId, "INITIAL").subscribe({
      next: resp => {
        if (resp.status === "OK") {
          this.stats.newRegistrations = resp.data;
        }
      },
      error: () => {
        console.error("Erreur lors de la récupération des inscriptions en attente.");
      }
    });
  }

  getRenewalRegistrations() {
    this.memberService.getNewOrRenewalAdherentForASession(this.sessionId, "REINSCRIPTION").subscribe({
      next: resp => {
        if (resp.status === "OK") {
          this.stats.renewalRegistrations = resp.data; // Correction ici
        }
      },
      error: () => {
        console.error("Erreur lors de la récupération des réinscriptions.");
      }
    });
  }



}
