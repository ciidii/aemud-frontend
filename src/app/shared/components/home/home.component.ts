import {Component, OnInit} from '@angular/core';
import {CardContentService} from "../../services/card-content.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cardContents !: any

  constructor(private cardContentService: CardContentService) {
  }

  ngOnInit(): void {
    this.cardContents = this.cardContentService.getCardContent()
  }

}
