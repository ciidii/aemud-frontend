import {Component, OnInit} from '@angular/core';
import {CardContentService} from "../../services/card-content.service";
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";

interface CardContentItem {
  imageUrl: string;
  title: string;
  description: string;
  linkTitle: string;
  retourLinh: string;
  disabled: string;
}

@Component({
  selector: 'app-shell',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterLink,
    NgForOf
  ],
  standalone: true
})
export class HomeComponent implements OnInit {
  cardContents !: CardContentItem[]

  constructor(private cardContentService: CardContentService) {
  }

  ngOnInit(): void {
    this.cardContents = this.cardContentService.getCardContent()
  }

}
