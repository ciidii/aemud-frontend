import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {YearOfSessionServiceService} from "../../../core/services/session/year-of-session-service.service";
import {YearOfSessionResponse} from "../../../core/models/session/YearOfSessionResponse";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-academic-info',
  templateUrl: './academic-info.component.html',
  styleUrls: ['./academic-info.component.css']
})
export class AcademicInfoComponent implements OnInit {

  @Output() academicInfoEvent = new EventEmitter<FormGroup>();
  academicFormGroup!: FormGroup;
  session!: YearOfSessionResponse;

  constructor(private _formBuilder: FormBuilder,
              private stepperContentService: StepperDataService,
              private sessionService: YearOfSessionServiceService,
              private toaster:ToastrService
  ) {
  }

  ngOnInit(): void {
    console.log("Je suis dans le formulaire academic")
    this.sessionService.getCurrentYear().subscribe({
      next: data => {
        if (data.status == "OK" && data.result == "Succeeded") {
          this.session = data.data;
        }else {
            this.toaster.error("Une errreur s'est prouduite Coté server")
        }
      }, error: err => {
        this.toaster.error("Une errreur s'est prouduite Coté server")
      }
    });

    this.academicFormGroup = this._formBuilder.group({
      idYear: [{value: this.session?.id, disabled: true}, [Validators.min(1)]],
      studiesLevel: ['', [Validators.required, Validators.minLength(3)]],
      university: ['', [Validators.required, Validators.minLength(3)]],
      faculty: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', [Validators.required, Validators.minLength(3)]],
      section: ['', [Validators.required, Validators.minLength(3)]],
    });
    const savedData = this.stepperContentService.getStepData(1);
    if (savedData) {
      this.academicFormGroup.patchValue(savedData);
    }

  }

  onSave() {
    this.academicInfoEvent.emit(this.academicFormGroup);
  }

  /*


  onPrevious() {
    this.previous.emit();
  }

   */

}
