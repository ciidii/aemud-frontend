import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SidebarService} from "../../services/sidebar.service";
import {Observable, switchMap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {AsideBareComponent} from "../aside-bare/aside-bare.component";
import {HeaderComponent} from "../header/header.component";
import {AppStateService} from "../../../core/services/app-state.service";
import {PeriodeMandatHttpService} from "../../../features/periode-mandat/services/periode-mandat-http.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    AsideBareComponent,
    HeaderComponent
  ]
})
export class LayoutComponent implements OnInit {

  isSidebarOpen$: Observable<boolean>;
  mandatHttpService = inject(PeriodeMandatHttpService);
  appStateService = inject(AppStateService);
  private sidebarService = inject(SidebarService);

  constructor() {
    this.isSidebarOpen$ = this.sidebarService.isOpen$;
  }

  ngOnInit(): void {
    this.mandatHttpService.getAllPeriodeMandats().pipe(
      switchMap(response => {
        if (response.data) {
          this.appStateService.setMandats(response.data);
          const activeMandat = response.data.find(m => m.estActif);
          if (activeMandat) {
            return this.mandatHttpService.getPeriodeMandatById(activeMandat.id);
          }
        }
        return [];
      })
    ).subscribe(activeMandatWithPhases => {
      if (activeMandatWithPhases && activeMandatWithPhases.data) {
        this.appStateService.setSelectedMandat(activeMandatWithPhases.data);
      }
    });
  }

}
