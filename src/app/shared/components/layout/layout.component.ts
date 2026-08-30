import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet, RouterLink} from "@angular/router";
import {SidebarService} from "../../services/sidebar.service";
import {Observable, switchMap} from "rxjs";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {AsideBareComponent} from "../aside-bare/aside-bare.component";
import {AppStateService} from "../../../core/services/app-state.service";
import {
  PeriodeMandatHttpService
} from "../../../features/configuration/periode-mandat/services/periode-mandat-http.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    NgIf,
    NgClass,
    AsideBareComponent
  ]
})
export class LayoutComponent implements OnInit {

  isSidebarOpen$: Observable<boolean>;
  isMobileOpen$: Observable<boolean>;
  mandatHttpService = inject(PeriodeMandatHttpService);
  appStateService = inject(AppStateService);
  private sidebarService = inject(SidebarService);

  constructor() {
    this.isSidebarOpen$ = this.sidebarService.isOpen$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  openMobileSidebar(): void {
    this.sidebarService.openMobile();
  }

  closeMobileSidebar(): void {
    this.sidebarService.closeMobile();
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
