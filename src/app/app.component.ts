import {Component, OnInit} from '@angular/core';
import {filter, interval, map, Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Aceuil';
  inter$!: Observable<number>

  constructor() {
  }

  ngOnInit(): void {
    this.inter$ = interval(1000);

    this.inter$.pipe(
      filter(value => value % 3 === 0),
      map(value => value % 2 === 0 ?
        `Je suis ${value} et je suis pair` :
        `Je suis ${value} et je suis impair`
      )).subscribe(value => console.log(value));
  }
}
