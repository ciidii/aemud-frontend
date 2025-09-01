import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SidebarService} from "../../services/sidebar.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {AsideBareComponent} from "../aside-bare/aside-bare.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    AsideBareComponent
  ]
})
export class LayoutComponent {

  private sidebarService = inject(SidebarService);
  isSidebarOpen$: Observable<boolean>;

  constructor() {
    this.isSidebarOpen$ = this.sidebarService.isOpen$;
  }

}
