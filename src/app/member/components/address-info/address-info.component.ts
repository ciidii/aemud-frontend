import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {UtilsService} from "../../../core/services/utils.service";

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

  constructor(private _formBuilder: FormBuilder,
              protected stepperDataService: StepperDataService,
              private utilsService: UtilsService
  ) {
  }

  ngOnInit() {
    var addressInfoLocalStorage;
    const local = localStorage.getItem("addressInfo");
    if (local) {
      addressInfoLocalStorage = JSON.parse(local)
    }
    this.addressFormGroup = this._formBuilder.group({
      memberID: [{value: addressInfoLocalStorage?.memberID || '', disabled: true}],
      idYear: [addressInfoLocalStorage?.idYear || '', [Validators.required, Validators.min(1)]],
      addressInDakar: [addressInfoLocalStorage?.addressInDakar || '', [Validators.required, Validators.minLength(3)]],
      holidayAddress: [addressInfoLocalStorage?.holidayAddress || '', [Validators.required, Validators.minLength(3)]],
      addressToCampus: [addressInfoLocalStorage?.addressToCampus || '', [Validators.required, Validators.minLength(3)]],
    });
    this.toggleAddressInfoSaved();
  }

  onSave() {
    this.addressInfoEvent.emit(this.addressFormGroup)
    this.toggleAddressInfoSaved()
  }

  toggleAddressInfoSaved() {
    this.utilsService.togglePersonalInfoSaved(this.addressFormGroup, this.stepperDataService.addressInfoSaved)
  }

  onModify() {
    this.stepperDataService.changeAddressInfoState()
    this.toggleAddressInfoSaved()
  }

  protected readonly onchange = onchange;
}
