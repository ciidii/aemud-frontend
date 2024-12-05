import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardContentService {
  private cardContent = [
    {
      imageUrl: "bi bi-person-lines-fill",
      title: "Membres",
      description: "Inscription, Réinscription de membre, ...",
      linkTitle: "Gérer membre",
      retourLinh: "/members/member/register-form"
    },
    {
      imageUrl: "bi bi-person-fill-add",
      title: "Cotisations",
      description: "Gestions des cotisations des membres",
      linkTitle: "Gérer cotisations",
      retourLinh: "/welcome/add"
    },
    {
      imageUrl: "bi bi-gear-fill",
      title: "Configurations",
      description: "Configurations du système",
      linkTitle: "Configurations",
      retourLinh: "/configurations/config/home"
    },
    {
      imageUrl: "bi bi-chat-right-dots-fill",
      title: "Messagerie",
      description: "Envoyer un message aux membres,...",
      linkTitle: "massagerie",
      retourLinh: "#"
    },
    {
      imageUrl: "bi bi-people-fill",
      title: "Jumellage",
      description: "Gérer le jumellage",
      linkTitle: "Génér jumellage",
      retourLinh: "#"
    },
  ]

  constructor() {
  }

  public getCardContent() {
    return this.cardContent;
  }
}
