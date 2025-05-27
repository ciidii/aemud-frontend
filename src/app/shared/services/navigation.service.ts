import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class NavigationService {
  // Chemins de base
  public readonly HOME = 'home';
  public readonly LOGIN = 'login';

  // Chemins pour les membres
  public readonly MEMBERS = '/members';
  public readonly MEMBER_LIST = `${this.MEMBERS}/list-members`;
  public readonly MEMBER_DETAILS = `${this.MEMBERS}/member-details`;
  public readonly MEMBER_REGISTRATION = `${this.MEMBERS}/member-registration`;
  public readonly MEMBER_ADD_FORM = `${this.MEMBERS}/register-form`;
  public readonly MEMBER_DASHBOARD = `${this.MEMBERS}/list-contribution`;

  // Chemins pour les configurations
  public readonly CONFIGURATIONS = '/configurations/l/';
  public readonly CONFIGURATIONS_BOURSE_ADMIN = `${this.CONFIGURATIONS}bourse-admin`;
  public readonly CONFIGURATIONS_COMMISSION_ADMIN = `${this.CONFIGURATIONS}commission-admin`;
  public readonly CONFIGURATIONS_CLUB_ADMIN = `${this.CONFIGURATIONS}club-admin`;
  public readonly CONFIGURATIONS_SESSION_ADMIN = `${this.CONFIGURATIONS}session-admin`;

  // Chemins pour les contributions
  public readonly CONTRIBUTIONS = '/contributions';
  public readonly CONTRIBUTION_ADD = `${this.CONTRIBUTIONS}/add-contribution`;

  // Chemins pour les notifications
  public readonly NOTIFICATIONS = '/notifications/l/';
  public readonly NOTIFICATIONS_SMS = `${this.NOTIFICATIONS}sms`;

  constructor(private router: Router) {
  }

  // Méthodes pour naviguer
  navigateToMemberDetails(memberId: number) {
    this.router.navigate([this.MEMBER_DETAILS, memberId]);
  }

  navigateToLogin() {
    this.router.navigate([this.LOGIN]);
  }
}
