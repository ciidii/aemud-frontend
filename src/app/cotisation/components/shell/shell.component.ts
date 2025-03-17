import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../../../core/header/header.component";

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent implements OnInit {
  asideNavContent!: any;

  ngOnInit(): void {
    this.asideNavContent = [
      {
        link: "/contribution/add-contribution",
        title: "Ajouter Une Cotisation",
        disabled: ""
      }

    ]
  }
}
