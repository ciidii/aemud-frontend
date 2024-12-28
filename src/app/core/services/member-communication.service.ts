import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {MemberData} from "../models/member/MemberData";

@Injectable({
  providedIn: 'root'
})
export class MemberCommunicationService {

  // Crée un objet Subject qui va émettre des événements lorsqu'on appelle ses méthodes next()
  private deleteMemberSubject = new Subject<MemberData>();

  // Crée un observable à partir du Subject pour que les composants puissent seulement s'abonner et non émettre des événements
  deleteMember$ = this.deleteMemberSubject.asObservable();

  // Méthode pour émettre un événement de suppression vers les composants abonnés
  updateMemberUi(member: MemberData) {
    this.deleteMemberSubject.next(member);
  }
}
