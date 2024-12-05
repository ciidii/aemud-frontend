import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberModule} from "../../member.module";
import {AppModule} from "../../../app.module";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-add-member',
  templateUrl: './bootstrap-stepper-form.component.html',
  styleUrls: ['./bootstrap-stepper-form.component.css'],
  imports: [
    MemberModule,
    AppModule,
    NgIf
  ],
  standalone: true
})
export class BootstrapStepperFormComponent implements OnInit {
  currentStep = 1;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  nextStep() {
    if (this.currentStep >= 4) {
      this.currentStep = 4
    } else {
      this.currentStep++;
    }


  }

  previousStep() {
    if (this.currentStep <= 0) {
      this.currentStep = 0;
    } else {
      this.currentStep--;
    }
  }
}
