import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../../../core/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  asideNavContent!: any;

  ngOnInit(): void {
    this.asideNavContent = [
      {
        link: "/contribution/contribute",
        title: "Ajouter Une Cotisation",
        disabled: ""
      }

    ]
  }
}
