import {Injectable} from '@angular/core';
import {MemberModel} from "../../member/model/member.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MemberCommunicationService {

  // Crée un objet Subject qui va émettre des événements lorsqu'on appelle ses méthodes next()
  private deleteMemberSubject = new Subject<MemberModel>();

  // Crée un observable à partir du Subject pour que les composants puissent seulement s'abonner et non émettre des événements
  deleteMember$ = this.deleteMemberSubject.asObservable();

  // Méthode pour émettre un événement de suppression vers les composants abonnés
  updateMemberUi(member: MemberModel) {
    this.deleteMemberSubject.next(member);
  }
}
