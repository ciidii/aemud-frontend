import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  cardContents !:any

  ngOnInit(): void {
    this.cardContents = [
      {imageUrl:"bi bi-person-lines-fill",title:"Membres",description:"Inscription, Réinscription de membre, ...",linkTitle:"Gérer membre",retourLinh:"/welcome/member"},
      {imageUrl:"bi bi-person-fill-add",title:"Cotisations",description:"Gestions des cotisations des membres", linkTitle:"Gérer cotisations", retourLinh:"/welcome/add"},
      {imageUrl:"bi bi-gear-fill",title:"Configurations",description:"Configurations du système",linkTitle: "Configurations",retourLinh:"#"},
      {imageUrl:"bi bi-chat-right-dots-fill",title:"Messagerie",description:"Envoyer un message aux membres,...",linkTitle:"massagerie",retourLinh:"#"},
      {imageUrl:"bi bi-people-fill",title:"Jumellage",description:"Gérer le jumellage",linkTitle:"Génér jumellage",retourLinh:"#"},
    ]
  }

}
