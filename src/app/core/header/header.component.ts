import {Component, OnInit} from '@angular/core';
import {CardContentService} from "../../shared/services/card-content.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  public headerContent!: any
  constructor(private cardContent: CardContentService) {
  }

  ngOnInit(): void {
      this.headerContent = this.cardContent.getCardContent()
  }
}
