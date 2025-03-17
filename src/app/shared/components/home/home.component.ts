import {Component, OnInit} from '@angular/core';
import {CardContentService} from "../../services/card-content.service";
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-shell',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterLink,
    NgForOf
  ],
  standalone: true
})
export class HomeComponent implements OnInit {
  cardContents !: any

  constructor(private cardContentService: CardContentService) {
  }

  ngOnInit(): void {
    this.cardContents = this.cardContentService.getCardContent()
  }

}
