import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css']
})
export class AddressInfoComponent implements OnInit {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() addressInfoEvent = new EventEmitter<FormGroup>();
  addressFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private stepperDataService: StepperDataService) {
  }

  ngOnInit() {
    this.addressFormGroup = this._formBuilder.group({
      memberID: [{value: '', disabled: true}],
      idYear: ['', [Validators.required, Validators.min(1)]],
      addressInDakar: ['', [Validators.required, Validators.minLength(10)]],
      holidayAddress: ['', [Validators.required, Validators.minLength(10)]],
      addressToCampus: ['', [Validators.required, Validators.minLength(10)]],
    });

    const savedData = this.stepperDataService.getStepData(2);
    if (savedData) {
      this.addressFormGroup.patchValue(savedData);
    }
  }

  onSave() {
    this.addressInfoEvent.emit(this.addressFormGroup)
  }

  /*
  onNext() {
    // Enregistrer les données de l'étape 2
    this.stepperDataService.setFormData(2, this.addressFormGroup.value);
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }
   */
}
