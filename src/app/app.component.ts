import {Component, OnInit} from '@angular/core';
import {filter, interval, map, Observable} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(
    private activatedRoute:ActivatedRoute,
    private titleService:Title,
    private router:Router
  ) {
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd), // Filtrer uniquement les fins de navigation
        map(() => {
          let route = this.activatedRoute.firstChild;
          while (route!.firstChild) {
            route = route!.firstChild;
          }
          return route!.snapshot.data['title']; // Récupérer le titre défini dans les routes
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(title); // Définir le titre
        }
      });
  }
}
