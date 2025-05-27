import {Component, OnInit} from '@angular/core';
import {CardContentService} from "../../shared/services/card-content.service";
import {FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgFor, FormsModule]
})
export class HeaderComponent implements OnInit{
  public headerContent!: any
  constructor(private cardContent: CardContentService) {
  }

  ngOnInit(): void {
    this.headerContent = this.cardContent.getCardContent()
  }
}
