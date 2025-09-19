import { Component, OnInit } from '@angular/core';
import { CardContentService } from "../../services/card-content.service";
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from "../../../core/services/session.service";
import { AuthService } from "../../../features/auth/services/auth.service";
import { Observable } from "rxjs";

interface HeaderContentItem {
  imageUrl: string;
  title: string;
  description: string;
  linkTitle: string;
  retourLinh: string;
  disabled: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, AsyncPipe]
})
export class HeaderComponent implements OnInit {
  public headerContent!: HeaderContentItem[];
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private cardContent: CardContentService,
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.headerContent = this.cardContent.getCardContent();
    this.isLoggedIn$ = this.sessionService.isLoggedIn$;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
