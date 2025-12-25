import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {
  CustomMultiselectComponent
} from "../../../../../shared/components/custom-multiselect/custom-multiselect.component";
import {MemberStateService} from "../../../services/member.state.service";
import {filter, map, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ClubService} from "../../../../configuration/services/club.service";
import {CommissionService} from "../../../../configuration/services/commission.service";
import {BourseService} from "../../../../configuration/services/bourse.service";
import {Club, Commission} from "../../../../../core/models/member-data.model";
import {AppStateService} from "../../../../../core/services/app-state.service";
import {RegistrationStatus} from "../../../../../core/models/RegistrationModel";
import {PhaseHttpService} from "../../../../periode-mandat/services/phase-http.service";
import {PeriodeMandatHttpService} from "../../../../periode-mandat/services/periode-mandat-http.service";

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomMultiselectComponent,
    AsyncPipe
  ],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss'
})
export class FilterPanelComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() applyFilters = new EventEmitter<any>();
  @Output() resetFilters = new EventEmitter<void>();
  filterForm!: FormGroup;
  clubs$!: Observable<Club[]>;
  commissions$!: Observable<Commission[]>;
  bourses$!: Observable<{ id: number, name: string }[]>;
  phases$!: Observable<{ id: string, name: string }[]>;
  mandats$!: Observable<{ id: string, name: string }[]>;
  protected readonly RegistrationStatus = RegistrationStatus;
  private formBuilder = inject(FormBuilder);
  private memberStateService = inject(MemberStateService);
  private clubService = inject(ClubService);
  private commissionService = inject(CommissionService);
  private bourseService = inject(BourseService);
  private phaseService = inject(PhaseHttpService);
  private appStateService = inject(AppStateService);
  private mandatService = inject(PeriodeMandatHttpService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      paymentStatus: [null],
      registrationStatus: [null],
      club: [],
      commission: [],
      bourse: [],
      mandatIds: [],
      phaseIds: []
    });

    this.memberStateService.searchMemberParamsObject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(currentParams => {
      this.filterForm.patchValue(currentParams, {emitEvent: false});
    });

    this.clubs$ = this.clubService.getAllClubs();
    this.commissions$ = this.commissionService.getAllCommissions();
    this.bourses$ = this.bourseService.getAllBourses().pipe(
      map(bourses => bourses.map(b => ({id: b.id, name: b.libelle})))
    );
    this.phases$ = this.appStateService.activeMandat$.pipe(
      filter((mandat): mandat is NonNullable<typeof mandat> => mandat !== null),
      switchMap(mandat => this.phaseService.getMandatPhases(mandat.id)),
      map(phases => phases.map(p => ({id: p.id, name: p.nom})))
    );
    this.mandats$ = this.mandatService.getAllPeriodeMandats().pipe(
      map(response => response.data.map(m => ({id: m.id, name: m.nom})))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onApply(): void {
    const formValue = this.filterForm.value;
    const transformedFilters: any = {};

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        transformedFilters[key] = formValue[key] === '' ? null : formValue[key];
      }
    }

    console.log('Transformed filters on apply:', transformedFilters);
    this.applyFilters.emit(transformedFilters);
    this.close.emit();
  }

  onReset(): void {
    this.filterForm.reset({
      paymentStatus: null,
      registrationStatus: null,
      club: [],
      commission: [],
      bourse: [],
      mandatIds: [],
      phaseIds: []
    });
    this.resetFilters.emit();
    this.close.emit();
  }
}
