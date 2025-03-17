import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {UtilsService} from "../../../core/services/utils.service";
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
    selector: 'app-info-personal',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.css'],
    standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf, NgForOf]
})
export class PersonalInfoComponent implements OnInit {
  personalInfo!: FormGroup
  @Output() personalInfoEmitter = new EventEmitter<FormGroup>
  maxDate!: string;

  constructor(private _formBuilder: FormBuilder, public steeperData: StepperDataService, private utilsService: UtilsService) {
  }

  ngOnInit(): void {
    var personalInfoDataFromLocalStorage = null;
    const json = localStorage.getItem("personalInfo");
    if (json) {
      personalInfoDataFromLocalStorage = JSON.parse(json)
    }

    const today = new Date();
    const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    this.maxDate = tenYearsAgo.toISOString().split('T')[0];
    this.personalInfo = this._formBuilder.group({
      name: [personalInfoDataFromLocalStorage?.name || '', [Validators.required, Validators.minLength(2)]],
      firstname: [personalInfoDataFromLocalStorage?.firstname || '', [Validators.required, Validators.minLength(2)]],
      nationality: [personalInfoDataFromLocalStorage?.nationality || '', [Validators.required, Validators.minLength(2)]],
      birthday: [personalInfoDataFromLocalStorage?.birthday || '', [Validators.required]],
      maritalStatus: [personalInfoDataFromLocalStorage?.maritalStatus || '', [Validators.required, Validators.minLength(2)]],
    });
    console.log(this.steeperData.getFormData())
    console.log("La valeure de pernalInfoSaved Dans personal Info est:" + this.steeperData.personalInfoSaved)
    this.togglePersonalInfoSaved()

  }

  onSave() {
    this.personalInfoEmitter.emit(this.personalInfo)
    this.togglePersonalInfoSaved()
  }

  togglePersonalInfoSaved() {
    this.utilsService.togglePersonalInfoSaved(this.personalInfo, this.steeperData.personalInfoSaved)
  }

  onModify() {
    this.steeperData.changePersonalInfoState();
    this.togglePersonalInfoSaved()
  }
}
