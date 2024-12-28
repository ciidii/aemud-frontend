import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {YearOfSessionServiceService} from "../../../core/services/session/year-of-session-service.service";
import {YearOfSessionResponse} from "../../../core/models/session/YearOfSessionResponse";
import {ToastrService} from "ngx-toastr";
import {UtilsService} from "../../../core/services/utils.service";
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-academic-info',
  templateUrl: './academic-info.component.html',
  styleUrls: ['./academic-info.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf]
})
export class AcademicInfoComponent implements OnInit {

  @Output() academicInfoEvent = new EventEmitter<FormGroup>();
  academicFormGroup!: FormGroup;
  session!: YearOfSessionResponse;

  constructor(private _formBuilder: FormBuilder,
              protected stepperData: StepperDataService,
              private sessionService: YearOfSessionServiceService,
              private toaster: ToastrService,
              private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    const local = localStorage.getItem('academicInfo');
    var academicInfoLocalStorage;
    if (local) {
      academicInfoLocalStorage = JSON.parse(local)
    }
    this.sessionService.getCurrentYear().subscribe({
      next: data => {
        if (data.status == "OK" && data.result == "Succeeded") {
          this.session = data.data;
          console.log(this.session.id)
        } else {
          this.toaster.error("Une errreur s'est prouduite Coté server")
        }
      }, error: err => {
        this.toaster.error("Une errreur s'est prouduite Coté server")
      }
    });

    this.academicFormGroup = this._formBuilder.group({
      memberID: [''],
      idYear: [''],
      studiesLevel: [academicInfoLocalStorage?.studiesLevel || '', [Validators.required, Validators.minLength(3)]],
      university: [academicInfoLocalStorage?.university || '', [Validators.required, Validators.minLength(3)]],
      faculty: [academicInfoLocalStorage?.faculty || '', [Validators.required, Validators.minLength(3)]],
      department: [academicInfoLocalStorage?.department || '', [Validators.required, Validators.minLength(3)]],
      section: [academicInfoLocalStorage?.section || '', [Validators.required, Validators.minLength(3)]],
    });
    this.toggleAcademicInfoSaved()
  }

  onSave() {
    this.academicInfoEvent.emit(this.academicFormGroup);
    this.toggleAcademicInfoSaved()
  }

  toggleAcademicInfoSaved() {
    this.utilsService.togglePersonalInfoSaved(this.academicFormGroup, this.stepperData.academicInfoSaved)
  }

  onModify() {
    this.stepperData.changeAcademicInfoState()
    this.toggleAcademicInfoSaved()
  }
}
